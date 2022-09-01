- [Table batch reads and writes](#table-batch-reads-and-writes)
  - [What is table in databricks:](#what-is-table-in-databricks)
  - [Create a table.](#create-a-table)
  - [Control Data Location of delta tables.](#control-data-location-of-delta-tables)
  - [Reading a table](#reading-a-table)
  - [Time Travel](#time-travel)
  - [Data retention](#data-retention)
  - [Schema Validation](#schema-validation)
  - [Schema Evolution:](#schema-evolution)

<hr>
<br />
<br />

# Table batch reads and writes

Delta lake supports most of the options provided by Apache Spark Data Frame read and writes apis for performing batch reads and writes on tables.

## What is table in databricks:
A databricks table is a collection of structured data. **A Delta table stores data as a directory of files on cloud object storage and registers table metadata to metastore within a catalog ans schema.** There are two kinds of tables in Databricks,
  - ***Managed tables***: 
    Databricks manages both the metadata and the data for a managed tables. When you drop a table, it also deletes the underlying data. The data for a managed table resides in the location of database it is registered to. 
    ```sql
    --creating managed tables
    CREATE TABLE <TABLE_NAME> AS SELECT * FROM <ANOTHER_TABLE>

    CREATE TABLE <TABLE_NAME> (field type, field type)
    ```
    ```python
    df.write.saveAsTable('table_name')
    ```
  - ***Unmanaged tables***: 
    Databricks only manages the metadata for unmanaged tables; when we drop a table, it doesnot affect the underlying data. *Unmanaged table will always specify a `location` during table creation.* We can either register an existing directory of data files as a table or provider a path when a table is first defined. Because data and metadata are managed independently, *we can rename a table or register it to a new database without needing to move nay data. 

    ```sql
    CREATE TABLE <TABLE_NAME>
    USING DELTA
    LOCATION '/path/to/existing/data'
    ```

    ```sql
    CREATE TABLE <TABLE_NAME>
    (field type, field type)
    USING DELTA
    LOCATION 'path/to/empty/directory'
    ```

    ```python
    df.write.option("path", "/path/to/empty/directoy").saveAsTable("table_name")
    ```


## Create a table.

Delta lake supports creating two types of tables
- Tables defined in the metastore
- table defined by the path

**Tables defined in metastore**

```sql
CREATE TABLE IF NOT EXISTS default.people10m (
  id INT,
  firstName STRING,
  middleName STRING,
  lastName STRING,
  gender STRING,
  birthDate TIMESTAMP,
  ssn STRING,
  salary INT
) USING DELTA
```

**Table defined by path**
```sql
CREATE OR REPLACE TABLE delta.`/tmp/delta/people10m` (
  id INT,
  firstName STRING,
  middleName STRING,
  lastName STRING,
  gender STRING,
  birthDate TIMESTAMP,
  ssn STRING,
  salary INT
) USING DELTA
```

**Data frame writer.**
```python
df.write.format('delta').saveAsTAble('default.people10m')
df.write.format('delta').mode('overwrite').save('/tmp/delta/people10m')
```


## Control Data Location of delta tables.
For table defined in the metastore, we can optionally specify the location as a path. *Tables created with a specified location are considered unmanaged by the metastore*. and Incase of managed table location path is not specified. **In case of unmanaged table's files are not deleted when you drop the table.**

when a `create table` statement is executed with `location` which already contains data stored using delta lake, delta lake does te following things.
- if you specify only the table name and location, Te table in the metastore automatically inherits the *schema*, *partitioning* and *table properties* of the existing data. **This is only way to import data into the metastore.**

```sql
CREATE TABLE default.people10m
USING DELTA
LOCATION '/tmp/delta/people10m'
```

- if you specify any configuration(schema, partitioning or table properties), Delta lake verifies that the specification exactly matches the configuration of the existing data. *if configuration doesn't match exception is thrown.*

## Reading a table
we can load delta table as a dataframe by specifying a table name or a path.

```sql
SELECT * FROM default.people10m;
SELECT * FROM delta.`/tmp/delta/people10m`
```

```python
spark.table("default.people10m")
spark.read.format('delta').load('/tmp/delta/people10m')
```

## Time Travel
Delta lake time travel allows you to query an older snapshot of a delta table. All the information like version Number and TimeStamp of operation performed in delta table can be obtained from command `DESCRIBE HISTORY <TABLE_NAME>`

example using as of syntax:
```sql
SELECT * FROM default.people10m TIMESTAMP AS OF '2018-10-18T22:15:12.013z'
SELECT * FROM default.people10m VERSION AS OF 123

SELECT * FROM default.people10m@20190101000000000 --the timestamp must be in yyyyMMddHHmmssSSS format.
SELECT * FROM default.people10m@v123
```

```python
df1 = spark.read.format('delta').option("timestampAsOf", "2018-10-18T22:15:12.013z").load("/tmp/delta/people10m")
df2 = spark.read.format('delta').option("versionAsOf",123).load("/tmp/delta/people10m")

spark.read.format('delta').load('/tmp/delta/people10m@20190101000000000') 
spark.read.format('delta').load('/tmp/delta/people10m@v123')
```

## Data retention
To time travel to a previous version, we must retain both the log and the data files for that version. The data files backing a Delta table are never deleted automatically; data files are deleted only when we run `VACCUM`. *VACCUM* does not delete Delta log files; log files are automatically cleaned up after checkpoints are written. By default time travel to a delta table up to 30 days old unless VACCUM command is ran.

## Schema Validation
Delta lake automatically validates that the schema of the Dataframe being written is compatible with the schema of the table. Delta lake uses the following rules to Determine whether a write from a Dataframe to a table is compatible: 
- All Dataframe columns must exists in the target table. if there are columns in the dataframe not present in the table, an exception is raised. Columns present in the table but not in the Dataframe are set to null.
- Dataframe column data types must match the column data types in the target table. 
- Dataframe column names cannot differ only by case.
  - spark can be used in case sensitive or insensitive(default) mode,
  - parquet is case sensitive when storing and returning column information.
  - Delta lake is case-preserving but insensitive when storing the schema.
  - This restriction has been added to avoid potential mistakes, data corruption or loss issues.
  - 

with Delta lake, the table's Schema is saved in json format inside the transaction log. Schema validation occurs on write. if Schema validation fails delta lake cancels the transaction. ie. no data is written.

**Delta lake support DDL to add new columns explicitly and the ability to update schema automatically.**


## Schema Evolution:
Schema evolution allow users to easily change a table's current schema to accommodate date that is changing over time. Most commonly used operations for ``append`` and ``overwrite``. Use ``.option('mergeSchema', 'true)`` to your ``.write`` or ``.writeStream`` spark command. ** also we can use ``spark.databricks.delta.schema.autoMerge = True`` to spark configuration. **use with caution, as schema enforcement will no longer warn you about unintended schema mismatches.**

The following types of schema changes are eligible.
  - adding new columns 
  - changing of data types from non-nullable to nullable
  - upcasts from ByteType => ShortType => IntegerType

There is also stronger form of Schema Evolution i.e with ``.option('overwriteSchema', 'true')``, This option allows us non read-compatible schema changes. Typically is used when overwriting the data.

the following types os schema changes are allowed in overwriteSchema
  - dropping a column
  - changing an existing column data types(in place)
  - Renaming column names that differ only by case



