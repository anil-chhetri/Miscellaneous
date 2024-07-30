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
