# Difference between Facts and Dimension table.

| Facts Table                                               |                                          Dimensional table                                          |
| :-------------------------------------------------------- | :-------------------------------------------------------------------------------------------------: |
| Measurements, metrics or facts, about a business process. | Companion table to the fact table contains descriptive attributes to be used as query constraining. |
| Defined by their grain or its most atomic level. | should be wordy, descriptive, complete and quality assured. |
| Fact table is a measureable event for which dimension table data is collected and is used for analysis and reporting. | Collection of reference information about a business. |
| Helps to store report labels and filter domain values in dimension table | load detailed atomic data into dimensional strutures. |
|doesn't contain hierarchy | contains hierarchies. for eg: location could contain country pin code, states etc. |



## Types of facts:

- Additive: Measures should be added to all dimensions.
- Semi-Additive: In this type of fact, measures may be added to some dimensions and not with others.
- Non=Additive: It stores some basic unit of measurement of a business process.


## Types of Dimensions:

- Conformed Dimensions: it is very fact to which it relates. This dimension is used in more than one-star schema or Datamart.
- Outrigger Dimensions: A dimension may have reference to another diemnsion table. These secondary dimensions called outrigger dimensions. *This kind of Dimensions should be used carefully.*
- Shruken Rollup Dimensions: These are subdivision of rows and columns of base dimension. *This kinds of dimensions are useful for developing aggregated fact tables.*
- Role-Playing Dimensions: A single physical dimension helps to reference multiple times in fact table as each reference linking to logically distinct role for dimension.
