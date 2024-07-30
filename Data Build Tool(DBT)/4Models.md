# DBT Model

## what is DBT Model? 
dbt can have 2 type of model in the project, python model and SQL Models. A model is a single SQL file or python that defines a transformation to your raw data. These transformation are typically organized in the `models` directory of your dbt project yml file, If you need it to be different folder you could change the location in `model-paths` option. dbt models enable to build data warehoue in a modular and maintainable way by defining each transformation as its own model. 

some important fact about model
- each `.sql` file contains one model/select statements.
- the model name is inherited from the filename.
- Models can be nested in subdirectories within the models directly.

When `dbt run` command is executed, the model is build in data warehouse by wrapping it in a `create view as` or `create table as` statements. 

some default behaiours of dbt model when we run `dbt run` command.
- It create a model as a view.
- Builds model in a target schema defined.
- use file name as the view name in the database.

we can  use `dbt_project.yml` file or config block to change the default behaviour


## **materializations** 

In dbt (data build tool), **materializations** determine how your models are stored in the data warehouse. Understanding the different types of materializations is crucial for optimizing performance and costs. Here’s an overview of the main types of materializations available in dbt and their best use cases:

### 1. Views
- **Default Materialization**: By default, models in dbt are materialized as views.
- **Behavior**: Views store only the SQL logic of the transformation and are re-computed every time they are queried.
- **Use Cases**: 
  - Ideal for development and initial project stages.
  - Suitable for small datasets and transformations that need real-time freshness.
  - Best for intermediate models that act as building blocks for more complex models.
- **Advantages**: Low cost and always up-to-date.
- **Disadvantages**: Slower query performance compared to tables, as the data must be recomputed on each query.

### 2. Tables
- **Behavior**: Tables store the data itself, not just the transformation logic.
- **Use Cases**: 
  - Ideal for models that are queried frequently.
  - Suitable for large datasets and complex transformations that do not need real-time updates.
  - Best for final models that serve dashboards or reports where performance is critical.
- **Advantages**: Faster query performance since the data is precomputed and stored.
- **Disadvantages**: Higher storage costs and data only reflects the state at the last build time.

### 3. Incremental Models
- **Behavior**: Incremental models are designed to handle large datasets efficiently by processing only new or changed data since the last run, rather than reprocessing the entire dataset every time.
- **Use Cases**: 
  - Ideal for very large datasets where full refreshes are computationally expensive.
  - Suitable for scenarios where new data is appended, and existing data is rarely modified.
- **Advantages**: Reduces build times and computational costs.
- **Disadvantages**: More complex to configure and manage. Requires careful handling of late-arriving data and historical changes.

**How They Work**:
1. **Initial Run**: The first time an incremental model runs, it processes the entire dataset and stores the result in a table.
2. **Subsequent Runs**: In future runs, the model only processes new or updated records and merges these changes with the existing table.


**Configuration**:
- Incremental models require specific configuration in the model file using the `{{ config(materialized='incremental') }}` syntax.
- You need to define how to identify new or updated records using an `is_incremental()` function.


```sql
-- models/incremental_model.sql
{{ config(
    materialized='incremental'
) }}

with new_data as (
    select * from source_table
    where updated_at > (select max(updated_at) from {{ this }})
)

select * from new_data
```



### 4. Ephemeral Models
- **Behavior**: Ephemeral models do not persist in the database; instead, they are used to build complex transformations that are embedded directly into downstream queries. Ephemeral models are temporary models that exist only during the dbt run and are not materialized in the data warehouse. They are used to create intermediate transformations that feed into other models.
- **Use Cases**: 
  - Useful for intermediate transformations that are only needed temporarily.
  - Best for avoiding unnecessary materializations and reducing build complexity.
- **Advantages**: Reduces storage usage as the data is not persisted.
- **Disadvantages**: Can increase query complexity and execution time since transformations are re-executed in downstream models.


**How They Work**:
- Ephemeral models are computed at runtime and their SQL logic is inlined into the downstream models that reference them.
- They are useful for breaking down complex transformations into manageable steps without storing intermediate results.


**Configuration**:
- Ephemeral models are configured using `{{ config(materialized='ephemeral') }}`.


```sql
-- models/ephemeral_model.sql
{{ config(
    materialized='ephemeral'
) }}

select 
    id,
    event,
    timestamp
from raw_events

-- models/final_model.sql
with transformed as (
    select * from {{ ref('ephemeral_model') }}
)

select 
    id,
    event,
    timestamp
from transformed
```


### Comparison Table

| Feature                | Incremental Models                        | Ephemeral Models                        |
|------------------------|-------------------------------------------|-----------------------------------------|
| Purpose                | Efficiently process large datasets        | Create intermediate transformations     |
| Storage                | Materialized in the warehouse             | Not stored in the warehouse             |
| Performance            | Faster for large, frequently updated data | Reduces complexity, no impact on storage|
| Configuration          | `{{ config(materialized='incremental') }}`| `{{ config(materialized='ephemeral') }}`|
| Use Case               | Large datasets with frequent updates      | Modular, intermediate transformations   |



### Best Practices for Materializations
- **Start Simple**: Begin with views for simplicity and adjust to tables or incremental models as performance or cost requirements dictate.
- **Scope Configurations**: Configure materializations at the folder level in `dbt_project.yml` to keep your code DRY (Don't Repeat Yourself).
- **Staging Models**: Use views for staging models to ensure they are always up-to-date, as these are rarely queried directly by end-users【10†source】【11†source】.

### Configuration
Materializations can be configured in three ways in dbt:
- **Project File (`dbt_project.yml`)**: Defines default materializations for models within specific directories.
- **Property File (`models/properties.yml`)**: Sets materializations for specific models within the project.
- **Config Block (`models/<model_name>.sql`)**: Overrides project or property file settings for individual models using the `{{ config(materialized='table') }}` syntax【12†source】.

For more detailed information and examples on configuring and using different materializations, you can visit the [dbt documentation](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/materializations).
