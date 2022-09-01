```docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=yourStrong(!)Password" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```
### Execution Plans

An execution plan in SQL Server is a simple graphical 
representation of the operations that the query optimizer generates to calculate the most efficient way to return a set of results.

Once a query is executed, the query processing engine quickly generates multiple execution plans and selects the one which returns the results with the best performance. 

#### Execution Plans Formats

SQL Server can output the execution plan in three different ways.
    - XML Plan
    - Text Plan
    - Graphical Plan
The one you choose will depends on the level of detail you want to see, and on the methods used to capture or view that plan.

#### Graphical Plan
there are two ways to see graphical plan that will be used by query to generate result.

- **Estimated Execution Plan**: This type of execution plan is just a guess by the query processor about how specific steps that are to be involved while returning the results. It is often generated before the query has been executed.
- **Actual Execution Plan**: This type of plan is generated after query has been executed. It shows the actual operations and steps involved while executing the query. This may or may not differ from the Estimated Execution Plan.

![Execution plans](images/Execution%20Plans.PNG)

Each node in the tree structure is represented as an icon that specifies a logical or physical operator(eg: Index scan, Hash Aggregate) The first icon is a language element called the Result operator, which represent the select statement and is usually the root element in the plan.
The query optimizer builds an execution plan and choose which operation may read records from the database(index scan), alternatively, it may read records from another operator, which reads records from the Index scan operator. Each node in the plan is related to a parent node, connected with arrowheads, the width of arrowhead is proportional to the number of row being transferred.

Basically, in this plan, the Index scan operator is reading all 19614 rows from an index,and the has aggregate operator is processing these rows to obtain the list of distinct cities.

The following information is obtained by hovering the mouse tip over the operator(index scan.)

![tooltip information](images/Execution%20plan%20tooltip.PNG)

#### XML Plan

Once you have displayed a graphical plan, you can also easily display it in XML format. Simply right click
anywhere on the execution plan window to display a pop-up menu


![sql query](images/Execution%20plans%20options.PNG)

