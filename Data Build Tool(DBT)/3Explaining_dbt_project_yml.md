# Content of dbt_project.yml

dbt_project.yml is the main file need for dbt project to run and dbt to identify that the project is dbt. It also contains the configuration need for dbt project to operate. 
By default, dbt looks for the dbt_project.yml in your current working directory and its parents, but you can set a different directory using the `--project-dir` flag or the `DBT_PROJECT_DIR` environment variable. 



### 1. `name`
- **Description:** `name: string`;  This sets the name of your dbt project. It's a unique identifier for your project within the dbt ecosystem. Must be letters, digits and underscores only, and cannot start with a digit. It is recommended to used `camel case` for naming the project variables.

### 2. `version`
- **Description:** Specifies the version of your dbt project. This is useful for tracking changes and ensuring compatibility with dbt versions or other dependencies.

### 3. `config-version`
- **Description:** Indicates the version of the configuration file format. For dbt v2.0 and later, this should be set to `2`. It helps dbt understand how to interpret the settings in the `dbt_project.yml`.

### 4. `profile`
- **Description:** Specifies the name of the profile to use, which contains the database connection details like credentials and data warehouse settings. Profiles are defined in the `profiles.yml` file or `~/.dbt/`. This configuration is only need when you are building the dbt project in local environment, but when you are building the project in dbt cloud in that case we don't need the profile configuration. Apart from the file `profiles.yml` or `~/.dbt/` we are also pass the profile.yml as a flag `--profile` when runinng the dbt project.


### 5. `model-paths`
- **Description:** Lists directories where dbt will search for source files such as models and source files. You can specify multiple paths if your models are organized in different directories. By default dbt will search for models directory, i.e. `model-paths: ["models"]`

### 6. `analysis-paths`
- **Description:** Defines where dbt should look for analysis files, which are used to create reports or perform additional data analysis. This is particularly useful for managing ad-hoc queries and documentation.

### 7. `test-paths`
- **Description:** Specifies directories containing test files. These files define tests that validate the quality and integrity of your data. test sql files under the directory pointed on this paths will have singular tests. singular test are test defined by sql queries that will return failing records. We call these "singular" data tests, because they're one-off assertions usable for a single purpose.

### 8. `seed-paths`
- **Description:** Lists directories containing seed files. Seeds are CSV files that dbt can load into your data warehouse. These are useful for adding static data to your models.

### 9. `macro-paths`
- **Description:** Defines directories where dbt will look for macro files. Macros are reusable SQL snippets or functions that can be used across different parts of your dbt project.

### 10. `log-path`
- **Description:** Specifies the directory where dbt will store log files. This helps in tracking the execution of dbt runs and troubleshooting any issues.


### 11. `target-path`
- **Description:** Defines where dbt will store compiled SQL files and other artifacts generated during dbt runs. By default, this is typically set to `target`. Just like other global configs, it is possible to override these values for your environment or invocation by using the CLI option `(--target-path)` or environment variables `(DBT_TARGET_PATH)`.

### 12. `packages-install-path`
- **Description:** Specifies the directory where dbt will look for external dbt modules. Modules are third-party packages or custom code that extend the functionality of dbt.

### 13. `seed-paths`
- **Description:** Lists directories containing seed files. This configuration allows dbt to find and load seed files into your data warehouse. by default dbt expects seeds to be located in the seeds directory. 

### 14. `on-run-start`
- **Description:** Defines a list of commands to run before dbt starts its execution. This can be used for setup tasks such as initializing databases or preparing the environment. this command are also run at the end of following commands: `dbt build`, `dbt compile`, `dbt docs generate`, `dbt run`, `dbt seeds`, `dbt snapshot` or `dbt test`

### 15. `on-run-end`
- **Description:** Specifies a list of commands to execute after dbt completes its run. This is useful for cleanup tasks, notifications, or post-processing.

### 16. `require-dbt-version`
- **Description:** Sets the minimum dbt version required for your project. This ensures that your project runs with a compatible version of dbt and prevents issues related to version mismatches.

### 17. `vars`
- **Description:** Allows you to define custom variables that can be used throughout your dbt project. These variables can be referenced in models, macros, and other dbt files. Variables can be used to `configure timezones`, `avoid hardcoding table names` or otherwise provide data to models to configure how they are compiled. To use a variable in a model, hook, or macro, use the `{{ var('...') }}` function

### 18. `models`
- **Description:** Configures settings specific to models within your project. This includes defining how models are materialized (e.g., as tables or views) and specifying schemas and other settings.


### 19. `seeds`
- **Description:** Configures settings specific to seed files, including how they should be materialized and other options related to seed file processing.

### 20. `snapshots`
- **Description:** Configures settings for snapshot files, which are used to capture historical changes to your data over time.

### 21. `tests`
- **Description:** Configures settings for dbt tests, including how tests are executed and reported. This can include setting severity levels for test results.

### 22. `analysis`
- **Description:** Configures settings for analysis files. This can include enabling or disabling certain analysis files and other related settings.

```yaml
name: my_dbt_project
version: 1.0.0
config-version: 2

profile: my_profile

model-paths:
  - models
  - analytics

analysis-paths:
  - analysis

test-paths:
  - tests

data-paths:
  - data

macro-paths:
  - macros

log-path: logs
target-path: target
modules-path: dbt_modules
seed-paths:
  - seeds

on-run-start:
  - "echo 'Starting dbt run...'"
  - "python scripts/setup.py"

on-run-end:
  - "echo 'dbt run completed!'"
  - "python scripts/cleanup.py"

require-dbt-version: "1.3.0"

vars:
  my_custom_variable: "value"

models:
  my_dbt_project:
    marts:
      +materialized: table
      +schema: analytics

seeds:
  my_dbt_project:
    +header: true
    +quote_columns: false

snapshots:
  my_dbt_project:
    +strategy: timestamp
    +updated_at: updated_at

tests:
  +severity: warn

analysis:
  my_dbt_project:
    +enabled: true
```



`The + sign is used to specify configurations at a higher level (like a project or directory level) that will be inherited by lower-level entities (like specific models or seeds). It allows for cleaner, more maintainable configuration files by applying settings consistently without needing to repeat them.`

Each of these configurations allows you to tailor the behavior and organization of your dbt project to fit your needs, ensuring that your data transformation workflows are efficient and well-managed. For more detailed information on any of these topics, please refer to the [dbt documentation](https://docs.getdbt.com/docs/introduction).
