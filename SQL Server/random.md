We have a backup of a large database having multiple file groups. We need to restore the backup to get the data in one file group. But restoring the whole database is impossible due to the unavailability of the required space. So how can we restore the data we need? Could you answer with the demo?

for more [link](https://www.sqlservercentral.com/articles/filegroup-restoring-and-database-consistency)

```sql
/**
creating test database with different file grop
**/



drop database if exists test

CREATE DATABASE [test]
 ON  PRIMARY 
( NAME = N'test01', FILENAME = N'/var/opt/mssql/data/test01.mdf' , SIZE = 8192KB , FILEGROWTH = 65536KB ), 
 FILEGROUP [fg_firstgroup] 
( NAME = N'test02', FILENAME = N'/var/opt/mssql/data/test02.ndf' , SIZE = 8192KB , FILEGROWTH = 65536KB ), 
 FILEGROUP [fg_secondgroup] 
( NAME = N'test03', FILENAME = N'/var/opt/mssql/data/test03.ndf' , SIZE = 8192KB , FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'test01_log', FILENAME = N'/var/opt/mssql/data/test01_log.ldf' , SIZE = 8192KB , FILEGROWTH = 10% )
GO
			 
use test
go


CREATE TABLE [dbo].table1(
    [Id] [bigint] NOT NULL,
    [label] [nvarchar](256) NOT NULL,
	[tablename] [nvarchar](256) not null
)on [fg_firstgroup]



CREATE TABLE [dbo].table2(
    [Id] [bigint] NOT NULL,
    [label] [nvarchar](256) NOT NULL,
	[tablename] [nvarchar](256) not null
)on [fg_secondgroup]



/* inserting dummy date */


insert into dbo.table1
select 1, 'label1', 'table1'
union 
select 2, 'label1', 'table1'



insert into dbo.table2
select 1, 'label2', 'table2'
union 
select 2, 'label2', 'table2'




/** restoring [fg_secondgroup] file group to different database */

--creating backup of the database

use master
go


BACKUP DATABASE test 
  TO DISK = 'test_FULL.bak'
  WITH INIT, FORMAT
go


drop database test;
go



RESTORE DATABASE test_backup
  FILEGROUP = 'fg_secondgroup'
  FROM DISK = 'test_FULL.bak'
  WITH partial , RECOVERY


  select * from test_backup.dbo.table2 
  go
  select * from test_backup.dbo.table1 
  go

  /*
  for table1 we get following error:
  The query processor is unable to produce a plan for the table or view 'table1' because the table resides in a filegroup that is not online.
  */
```



q2.
A database has 3 schemas, namely transaction, account and admin and 3 user roles, one for each schema, named the same as the schema. Implement the security such that the users of a role have access to the objects of their schema only and not others.


```sql
create database test

use test
go

go

create schema [transaction];
go

create schema account; 
go

create schema [admin];
go


--create dummy table in each schema

create table [transaction].test
(id int identity,
[label] nvarchar(256))

create table account.test
(id int identity,
[label] nvarchar(256))

create table [admin].test
(id int identity,
[label] nvarchar(256))



--creating dummy users

CREATE LOGIN dummyUser1 WITH PASSWORD = 'P@$$w0rd'
GO
CREATE USER dummyUser1 FOR LOGIN dummyUser1
go


CREATE LOGIN dummyUser2 WITH PASSWORD = 'P@$$w0rd'
GO
CREATE USER dummyUser2 FOR LOGIN dummyUser2
go


CREATE LOGIN dummyUser3 WITH PASSWORD = 'P@$$w0rd'
GO
CREATE USER dummyUser3 FOR LOGIN dummyUser3
go


--creating roles
create role [transaction]
create role [admin]
create role account


--adding dummy users to roles.
alter role [transaction] add member dummyUser1
alter role account add member dummyUser2
alter role [admin] add member dummyUser3

--granting permission to each roles
GRANT INSERT ON SCHEMA ::[transaction]  TO [transaction];
GRANT select ON SCHEMA ::[transaction]  TO [transaction];

GRANT INSERT ON SCHEMA ::account  TO account;
GRANT select ON SCHEMA ::account  TO account;

GRANT INSERT ON SCHEMA ::[admin]  TO [admin];
GRANT select ON SCHEMA ::[admin]  TO [admin];

go


--select table from other schema

execute as user='dummyUser1'
select * from [transaction].test
go

select * from account.test  -- give error
go

SELECT 
    USER_NAME() AS 'user_name'
    ,SUSER_NAME() AS 'suser_name'
    ,SUSER_SNAME() AS 'suser_sname'
    ,SYSTEM_USER AS 'system_user'

--reverting back to default user
revert
go


--test2
execute as user='dummyUser2'
select * from [transaction].test --give error
go

select * from account.test 
go

--checking current user
SELECT 
    USER_NAME() AS 'user_name'
    ,SUSER_NAME() AS 'suser_name'
    ,SUSER_SNAME() AS 'suser_sname'
    ,SYSTEM_USER AS 'system_user'

--reverting back to default user
revert
go

```




q3. If the .LDF file of the database got corrupted/dropped; 
how do you restore/Recover the database to the possible latest status? 
Could you explain the steps?

  > given only transaction log is corrupted.

  - we can rebuild the new transaction log of the database.
  - steps
    - take database offline
    - rename the original log file from the database location.
    - run the following sql command.
    - ```sql
        ALTER DATABASE <databaseName> 
        REBUILD LOG ON
	        (NAME= <logicalName>, FILENAME='path to new ldf')
        GO
        ```

> given whole database is corrupted.
- take the backup of the database at current stages.
- Restore most recent full backup
```sql
        RESTORE DATABASE <dbname>
        FROM DISK = 'C:\Backup\FullBackup.bak'
        WITH REPLACE;
```  
- apply all the recent transaction log available after the full back and after each transaction log restore perform integrity check for the database.
```sql
RESTORE LOG <dbname>
FROM DISK = 'C:\Backup\TransactionLogBackup1.trn'
WITH NORECOVERY;
go

DBCC CHECKDB (<dbname>) WITH NO_INFOMSGS;
```
