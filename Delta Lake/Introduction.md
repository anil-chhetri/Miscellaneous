## introduction of Delta Lake.

Delta lake is an open format storage layer that delivers reliability, security and performance on data lake - for both streaming and batch operations. By replacing data silos with a single home for structured, semi structured and unstructured data. *Delta lake is foundation of a cost-effective, highly scalable lakehouse.*

Delta lake is a data storage and management layer for data lake that enables to scale insights throughout organizations with a reliable single source of truth for all data workloads both batch and streaming. *Delta lake increase productivity by optimizing for speed at scale with performance features like advanced indexing and schema enforcement.*

### **What does Delta Offer Technically?**
- ACID Transactions
    - Atomicity, consistency, isolation, durability.
    - Ensure data integrity
    - Serializability(level of isolation)
- Scalable metadata Handling
    - Metadata as "big data"
    - spark processing
- Unified Batch and Streaming
    - Delta batch tables
    - streaming source and sink


### **How does delta table works?**

- Table as a directory
    - Optionally this is registered to the metastore or catalog.
- Data files as parquet
    - optimal file format
        - serializability
        - Columnar vs. Row
- Delta Transaction Logs
    - json files.
    

### **Strategies for optimizations**
- Bloom Filter Index
    - Data Structure
    - Skipping on arbitrary text
    - stores indices

- Z Order
    - Optimize command
    - Layout of data
    - Bin Packing 
    - Z ordering

    
