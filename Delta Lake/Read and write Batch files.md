- [Table batch reads and writes](#table-batch-reads-and-writes)
  - [Create a table.](#create-a-table)
  - [Control Data Location of delta tables.](#control-data-location-of-delta-tables)
  - [Reading a table](#reading-a-table)
  - [Time Travel](#time-travel)
  - [Data retention](#data-retention)

<hr>
<br />
<br />

# Table batch reads and writes

Delta lake supports most of the options provided by Apache Spark Data Frame read and writes apis for performing batch reads and writes on tables.

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

