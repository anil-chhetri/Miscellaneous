## Dimension 

- Dimension tables contains descriptive fields.
- Usually flat denormalised table
- Having single primary key column.
- Attributes are the primary target for declaring constrainsts.
Dimension characteristics should be verbose, descriptive and complete (no missing values)
- Usually represent many to one hierarchical relationship.

## Different Types of Dimension:
- Conformed Dimension
- Junk Dimension
- Degenerate Dimension
- Role-Playing Dimension
- Slowly Changing Dimension


### ***Conformed Dimension***:
- Conformed Dimension that are joined to multiple facts.
- Provides same structure, attributes and same meaning in every fact table.
- Improved data consistency
- Every row is unique and is at atomic level
- Enables cross process analysis by allowing various fact in same query
- Easy to update as all business rules are in one place
- contains primary and surrogate keys
- Date dimension is common conformed dimension (year, month, week, days etc.)
- Conformed Dimension are needed to build Dimensional Data Warehouse.


#### ***Junk Dimension***
- Dimension with simple attributes (flag, yes/no, true/false, id/description)
- values that do not change frequently.
- Eliminate small dimension for performance and better management
- Group highly correlated attributes into a single dimension.
- Reduce the number of dimensions(<= 26 dimension per fact table.>)
- Reduce the number of columns in the fact table.
- Reduce joins between facts and dimensions.


#### ***Degenerate Dimension***
- Dimension without attributes
- Receipt/Invoice Number, tracking number, order number etc.
- It is stored inside a fact table to reduce duplications
- Degenerate dimensions are added due to grain of facts tables.

#### ***Role-playing dimension***
- same dimension used for multiple purpose.
- used multiple times within the same fact giving different business context.
- best example is date dimension
- fact_order contains (order_date, due_date, and canelled_date etc.)
- Don't create multiple dim,instead create one dim_date.

#### ***Slowly Changing Dimension***
- Dimension that change over time.
- Manages current and historical version
- Build to track changes
- There are different types of SCD such as: 
    - Type 0 - Retain original 
    - Type 1 - Overwriting the old value.
    - Type 2 - New additional record.
    - Type 3 - Adding a new attribute column
    - Type 4 - using historical table.


#### *SCD Type 0*
- There are essentially no changes.
- The attributes will never changes
- facts always grouped by the original value.


#### *SCD Type 1*
- Overwrite old values
- Attributes always reflect the most recent assignment, disregarding historical changes.

#### *SCD Type 2*
- Create new additional record.
- added new flag column to identify the latest record.
- New primary key(SK), flag column and date columns added to track


#### *SCD Type 3*
- add a new column to the dimensions to preserve historical information.
- allows to query in 2 different realities.

#### *SCD Type 4*
- historical table used to track any changes separate to the diemnsioin table.
- The main dimension only keeps current data based on the present time period.


#### *SCD Store as Snapshots*
- Use table partitions and store as snapshot for dimensions
- All data is added to snapshot daily or weekly.


## Bridge Table.
- Used to resolve many to many relationships
- sits between fact and dimension
- Only containing key columns for the various table.
- Access requirement before implementing
- Loading of table can be complex.

## Facts
- contains the measurement created by an operational systems.
- at the lowest granularity captured by the business process
- Design entirely based on a physical activity, not influenced by the report
- contain foreign keys for each dimension associated 
- Meaures are used for queries and aggregations 
- primary key is usually a composite key.


### **different types of Facts.**
- **Types of Facts (Measures)**
    - **Additive**
    - **Semi Additive**
    - **Non Additive**
- **Types of facts tables**
    - **Transaction**
    - **Periodic**
    - **Accumulative**


### *Additive Facts*
- Measure that can be summed accross any of the dimension within the fact table.


### *Semi Additive facts*
- Measure that can be summed across some of the diemnsions within the fact table.

### *Non-Addtive facts*
- Measures that cannot be summed across any of te dimension within
the fact table.
- eg: discount

### *Transaction Fact table*
- Most common in dimensional modelling
- grain in one row per transaction 
- Lowest level of granularity and date dimension
- Additive measures
- can grow large very quick
- No update happens in these tables.

### *Periodic Fact Tables*
- Snapshot of the data for specific time(day, week, month, hours etc.)
- Grain in one row per time period
- semi-additive
- usuallly build from transaction fact table.
- smaller table size compared to Transacction Fact table.
- useful to get overview of kPI's

### *Accumulating Facct tables*
- One row per entire lifetime of an event or product
- has begining and an end date
- contains multiple date columns
- Update happens when each milestone is completed
- Eg: Processing of an order, insurance processing, material processing.
- Aggregation can be difficult to perform
- smallest in table size.

![fact tables.](https://slidetodoc.com/presentation_image_h/7c14dc1468b237d0554efacad7acba55/image-15.jpg)


