# ETCD Report

- Fábio Sá, up202007658@up.pt
- Inês Gaspar, up202007210@up.pt
- José Gaspar, up202008561@up.pt

## Abstract

The aim of this report is to explore in a theoretical way and with a practical component a non-relational database technology from one of the paradigms studied, key-value based databases. In this sense, ETCD was the technology chosen to approach this paradigm. This database is widely used for consistency in distributed systems.
Throughout this document, introductory information on the technology is presented, as well as its specificities and uses. This is followed by a use case scenario, as well as the models developed to support the solution found for it. Finally, the implementation of the prototype using ETCD is explained, taking into account the ideation mentioned and some considerations of the features implemented in this paradigm.


## 1 - Introduction

The increase in the amount of data and the complexity of systems has led to the creation of new database solutions in order to increase storage capacity and make them more efficient: non-relational databases.
In this way, one of the paradigms explored in this report emerged, key-value through the ETCD approach.
This type of database consists of storing data in sets of key-value pairs, with each key being a unique identifier for the corresponding value.
This approach has a very simple design and is quick to learn, since it only depends on the design of the key and most of the processing and manipulation required is on the application side. These NoSQL technologies allow for great scalability and better performance than relational databases. They are therefore often used as caching systems, where data is temporarily stored for quick access.
ETCD is a database often used for setting up cluster/distributed systems. It is especially used because of the strong consistency between nodes that it allows, which will be explored in the following sections, as well as through the use cases of this technology and the prototype developed.

## 2 - Techonology

In this section the chosen technology, ETCD, is going to be described in terms of features, data model, advantages, limitations an some use cases are also presented. 

### 2.1 - Overview

ETCD is free and follows an open-source licensing model. Its official documentation features many tutorials, demos, and installation instructions, as well as an extensive FAQ. The community is active and supportive, with user and developer forums on Google Groups, real-time updates on Twitter, and discussions on GitHub. Additionally, contributors and maintainers hold weekly online meetings via Zoom, with meeting documentation available and sessions archived on YouTube. As of the date of this report, it ranks 54th among the most used database engines and 5th in the key-value paradigm, according to the evaluation on db-engines.com.

The name "etcd" originated from two ideas: the unix "/etc" folder and "d"istributed systems. The "/etc" folder is a place to store configuration data for a single system, whereas etcd stores configuration information for large-scale distributed systems. Thus, it is widely used for configuration management, service discovery, and coordination in distributed systems.

ETCD provides a reliable way to store data across a cluster of machines and ensures strong consistency guarantees. Unlike most other NoSQL databases, ETCD is designed to be highly available and fault-tolerant, making it a popular choice for storing data in distributed systems. As specified by the CAP theorem (Consistency, Availability, Partition tolerance), in order to achieve strong consistency, ETCD sacrifices performance, which makes it not ideal for projects where execution time is crucial.

(https://etcd.io)
(https://www.ibm.com/topics/etcd)
(https://dbdb.io/db/etcd)
(https://medium.com/@extio/deep-dive-into-etcd-a-distributed-key-value-store-a6a7699d3abc)
(https://github.com/etcd-io/etcd)

### 2.1 - Features

As it is going to be described throughout this section, ETCD has several features, some of them unique, that make this database a good choice in many distributed systems.

#### 2.2.1 - Replication and node communication features

This database works in a cluster of machines (nodes), most times, in a distributed way (number of nodes of the cluster differ from 1). This cluster can be generated through an internal network between several nodes, connected by HTTPS. In etcd the number of nodes is preferably odd (1, 3, 5, etc) for resource management purposes.

ETCD is built on the Raft consensus algorithm to ensure data store consistency across all nodes in a cluster—table stakes for a fault-tolerant distributed system. This algorithm is based on quorums and as the name suggests it is used to have a consensus between a majority of nodes about the values that are being stored in the database, taking into account that one or more nodes may fail. In etcd, for a cluster with n members, the quorum size is (n/2)+1. For any odd-sized cluster, adding one node will always increase the number of nodes necessary for quorum.

These nodes do not need to be physically together, even though it may affect request latency. Etcd basically stablishes connection between nodes via HTTP + TLS. If the IP of the node is not known, etcd has a "discovery mode" that will find the node's IP address and establish the connection.
In terms of load balancing, it is usefull to state that there is a leader node. This node is responsible for ensuring data replication among non-leader nodes and balance the distribution of request among those nodes.
Even though it is possible to have multiple nodes in one cluster, etcd does not provide a way to support multiple clusters that can communicate with each other. To implement that feature, some communication protocol must be implemented between the clusters. One approach would be to put the leader node of each cluster in charge of that communication.

Each node has a copy of the data, and the data is replicated across the cluster. This means that, if a node fails, the data is still available on the other nodes, even if the leader is down - reelection is done. As such, having a leader does not represent a critical point of failure for the system. It only fails if the majority of nodes are down - consensus not obtained.
In ETCD there is a total replication of the data, that is - full-replication.

(https://www.ibm.com/topics/etcd)
(https://etcd.io/docs/v3.4/op-guide/clustering/)
(https://etcd.io/docs/v3.3/faq/)
(https://raft.github.io/)

#### 2.2.2 - Consistency features

ETCD provides sequential consistency, which is the stronger form of consistency that can be obtained in distributed systems. This means that, independently of the node of the cluster that receives the request from the client, it reads the same events in the same order.

Note that eventual consistency is not enough, specially in critical systems where, if in any moment, there are inconsistent states on the nodes, since they probably have configurations of systems stored in it (main purpose of ETCD), can cause critical problems to the systems, making it, for example, vulnerable to some mallicious attacks.

Consistency is one of the advantages of using a distributed database. It allows for multiple nodes to be updated at the same time, which can lead to inconsistencies in the data. To avoid this, ETCD provides a quorum like strategy, which ensures that the data is consistent across all nodes in the cluster even if some nodes are down at that given moment.
(https://etcd.io/docs/v3.3/learning/api_guarantees/)

#### 2.2.3 - Watcher feature

ETCD provides a functionality called watcher. this watcher can be used to monitor a given value of a certain key over time based on the operations executed over that key.

It can be especified if we want to monitor only the PUT, only the GET operations, or both, depending of the problem.
With this feature we can see how useful this database is regarding system configurations. With this monitoring feature it is extremely easy to see modifications in critical variables, helping to prevent any unwanted result.

#### 2.2.4 - Data processing features

- For example, map-reduce support

Regarding data processing features, etcd does not provide much. As an example, functions like counts, sums, averages, map-reduces that are supported by other databases have no translation in etcd, making mandatory to process information after querying the database.
As it can be seen in the oficial documentation of etcd, the main features supported by etcd are methods to read, write and delete data, besides the ability to monitor changes in a given key-value pair plus the possibility of knowing the version of the key (version is required internally to achieve consistency in a distributed system) and seeing old values for a given key.

However, it is not only in data processing features that etcd is not ideal, also on the data types that can be stored in etcd. These types consist in strings and numbers, so there are no lists, sets or more complex data types.
To bypass this limitation, one possible approach (implemented on the demo that is going to be described later on this report) is to use functions to serialize and deserialize json objects. With those functions we can transform a list or any other data type into a string, and then store it in etcd.

( https://etcd.io/docs/v3.6/dev-guide/interacting_v3/ )

### 2.3 - Data Model

The data model can be seen in a logical and physical way. Throughout this section both of them are going to be described.

#### 2.3.1 - Logical View

The store's logical view is a flat binary key space with a lexically sorted index for efficient range queries. It maintains multiple revisions, with each atomic mutative operation creating a new revision. Old versions of keys remain accessible through previous revisions, and revisions are indexed for efficient ranging. Revisions are monotonically increasing over time. The term revision is, in fact, a version of the key-value pair and it is possible to see the previous revisions of a given pair.

A key's life spans a generation from creation to deletion, with each key having one or multiple generations. Creating a key increments its version, starting at 1 if it doesn't exist. Deleting a key generates a tombstone, resetting its version to 0. Each modification increments a key's version within its generation.

#### 2.3.2 - Physiscal View

etcd stores data in a persistent B+tree, with each revision containing only the delta from the previous one for efficiency. Keys are represented as 3-tuples (major, sub, type), allowing differentiation and optional special values like tombstones. The B+tree is ordered lexically for fast ranged lookups over revision deltas. Compaction removes outdated key-value pairs. Additionally, etcd maintains an in-memory Btree index for speedy range queries, with keys exposed to users and pointers to modifications in the persistent B+tree.

(https://etcd.io/docs/v3.3/learning/data_model/)

### 2.4 - Supported Data Operations

ETCD provides an HTTP/JSON API that allows clients to perform CRUD operations on the data store. The API is designed to be simple and intuitive, and it is easy to use.
There are mainly 2 operations, GET and PUT. As the names sugest, these operations are used to retrieve a given value based on a key and store a new / existent key-value pair, respectively.
Still talking about the GET operation, it is possible to specify a range of keys, and the response will be a list of key-value pairs. This range of keys can only be specified by prefix. To exemplify, if the keys app:foo and app:bar exist, the prefix app: can be used to retrieve both keys and their respective values.
Regarding updates, they are just a new PUT, over the same key.
It is also possible to delete key-value pairs using the delete operation.
Regarding the watchers, via the API, it is possible to create them and generate a function that is going to run at each operation over the key that is being watched / monitored.

(https://github.com/microsoft/etcd3/blob/master/src/test)

### 2.5 - Use Cases
As previously mentioned, etcd is used mainly to perform system configurations in distributed systems.
The most important use cases are:
* Kubernetes
* Container Linux by CoreOS

( https://etcd.io/docs/v3.1/learning/why/ )

TODO by Zé

### 2.6 - Problematic Scenarios

As previously discussed, the lack of data processing features is a problematic scenario in etcd. It is not possible to perform complex operations on the data, like aggregations, joins, etc. and require pos-processing of data, making these operations less efficient.
Besides this, etcd allows to search keys by prefix however they do not allow to do it by suffix. This adds some constraints to the aggregates' creation. As an example we could easily get the amount of tickets available using the aggregate:
ticket:<event>:<ticket_type> : {
    current_quantity: int64,
    ...
}

because we can search for all keys that start with ticket:<event> and then sum the results (the current_quantity field) but we could not get the quantity of available tickets of a given type. If sufix search was implemented we could do it more efficiently.
Another problematic scenario is related with the restricted data types that can be stored in the database (numbers and strings). Since we need to keep a json encoded as string when more complex types are required, this makes attribute search impossible, so if I want to know only a given field, I have to recieve the entire entity and then select the attribute manually.

Etcd was developed to deal with small key-value pairs, typically designed to metadata. Hence, the maximum size of any request is 1.5 MiB. Similarly, the suggested maximum size of the database is 8 GiB (2 GiB is the default). With that said, we can conclude that this database was not built to be used as a cache, as it is not designed to store large amounts of data.

Fast disks are vital for etcd performance and stability. Slow disks increase request latency and cluster instability. Etcd's consensus protocol requires timely storage of metadata to a log, with most cluster members writing every request to disk. Etcd also checkpoints its state to disk for log truncation, and delays in these writes can cause heartbeat timeouts, triggering cluster elections and instability. Etcd is highly sensitive to disk write latency, needing at least 50 sequential IOPS (e.g., from a 7200 RPM disk) and ideally 500 sequential IOPS (e.g., from a local SSD or high-performance virtualized block device) for heavily loaded clusters. This limitation, together with the inability of writting a block of key-value pairs in one operation - would eventually surpass the 1.5MiB of request - makes the entire cluster slower when facing lots of consecutive writes. This drawback is noticeable when populating an etcd database for example.

Furthermore, etcd can also become problematic due to its own nature of replicating data totally. Yes, it is possible to have several nodes running to ensure data is (almost) never lost, however this makes the entire system slower with the increase of nodes, precisely due to data consistency and replication.

( https://etcd.io/docs/v3.4/dev-guide/limit/ )
( https://etcd.io/docs/v3.3/op-guide/hardware/ )

### 2.7 - ETCD vs. Other Solutions

- advantages and drawbacks noutras key-value solutions

As previously mentioned, ETCD is not like most key-value databases. It is recommended to be used when sequential consistency is needed, in distributed systems, and not to be used as a cache, like Redis, for example. There is a tradeoff between having a fast response time and having a consistent state. ETCD is made not to be fast but consistent while most key-value databases are made to be fast but not consistent.
The main advantage of ETCD is the ability of having more than one point of failure. Thanks to the leader election algorithms and the Raft consensus algorithm, if more than 50% of the nodes are up and running, the system will be able to continue working and accept new operations over the database. Then, when the nodes that fail recover, the state is fully replicated to those nodes achieving the sequential consistency that is needed and guaranteed by the API.
Other advantage, as specified in ETCD documentation, the maximum reliable database size of ETCD is of several gigabytes while others (e.g ZooKeeper and Consul) can support until hundreds of megabytes.
The main drawback is the performance of ETCD and the lack of ability of inserting larges amount of data in a block. Operations on database are restrict to one at a time.

## 3 - Prototype

To validate the main features, qualities, and potential bottlenecks of the mentioned ETCD technology, a prototype — proof of concept based on this key-value paradigm — was developed and presented in the following sections.

### 3.1 - Topic

In a classic scenario of purchasing tickets for events, data consistency is the most important aspect to consider. For example, each event should display its updated information in real-time, including the number of remaining tickets, regardless of the number of simultaneous purchases occurring. A failure in data replication and propagation within the system can result in event overbooking, inaccurately computed purchases, and potential revenue loss.

To ensure the system is immune to such issues, it is necessary to rely on a database that is simultaneously:

- Distributed, for horizontal scalability ensuring the system can handle the growing workload effectively;
- Fully-replicated, where every data read returns the latest data write across all clusters and nodes, something that is not achievable with eventual consistency;
- Highly available, to have no single point of failure and gracefully tolerate hardware failures and network partitions.

TickETCD, a web application for purchasing tickets for events, uses ETCD as a solution to the aforementioned problems. The implementation details will be described in the following subsections.

### 3.2 - Dataset

Given the unavailability of data of this nature suitable for the application, TickETCD's data is generated using the Python Faker library and a configuration file. Among other factors, this stage allows for changing the number of created users, the number of events, the probability of a user being an administrator, the probability of creating and triggering a notification, choosing locations and event types, as well as ticket types and price ranges.

These configurations are important to establish a system governed by scalable and parameterizable data. Although the data is invented and probabilistic, it is also reliable, adapted, and aligned with reality.

### 3.3 - Conceptual Data Model

In order to meet the needs of the application, the following relationships have been designed, as shown in figure [F1]:

![UML](../../imgs/UML.png)

An event has a name, location, date, type, a description, and a total quantity of available tickets. Each event may offer various ticket types, each associated with a price, as well as their initial and current total quantity. Users, identified by their name, email, password, and role, can have favorite events and request notifications when the quantity of tickets for a specific event reaches a certain limit. Additionally, users can purchase various types of tickets.

### 3.4 - Physical Data Model and Data Structures

The previous Conceptual Data Model could be implemented physically using relational database schemas, allowing for direct searches for relationships between entities. However, in the case of dealing with the key-value paradigm used in ETCD, it was necessary to resort to data redundancy to ensure complete knowledge of all relationships and still minimize the number of post-processing steps.

Below are presented the key and value structures and agregates used for the design of the entire data structure required by TickETCD. It should be noted that for the purpose of data visualization and manipulation, JSON was used, although physically, they are just strings after serialization, as ETCD does not support other data types as values for its keys, as described in the previous sections.

#### 3.4.1 - User

Without any post-processing, it is possible to query all information related to a user by querying the key in the format `user:<USERNAME>`. Example:

```json
"user:johndoe": { 
    "name": "jonh doe", 
    "email": "john@mail.com", 
    "password": "john123", 
    "role": "admin"
}
```

#### 3.4.2 - Event

Similarly to a user, the information about an event can be accessed by a simple query using the key `event:<ID>`. Example:

```json
"event:92fe965d-a189-4f26-844c-0979c6ca035e": {
    "name": "Simple concert", 
    "description": "A simple event example", 
    "location": "porto",
    "type": "concert",
    "date": "2024-03-13",
    "current_quantity": "14",
}
```

#### 3.4.3 - Ticket

Given an event and a ticket type, it is possible to determine their current characteristics by using the key in the format `ticket:<EVENT_ID>:<TYPE>`. Example:

```json
"ticket:92fe965d-a189-4f26-844c-0979c6ca035e:pink": {
    "total_quantity": "34", 
    "current_quantity": "23", 
    "price": "23.99",
}
```

The ticket type is the same and fixed for all events, so there would be no issue in declaring this key in the format `ticket:<TYPE>:<EVENT_ID>`. The ticket types will be addressed in a later section.

#### 3.4.4 - Notification

Given that a user can activate a notification for a specific event, the structure `notification:<USERNAME>:<EVENT_ID>` was used to store this data:

```json
"notification:johndoe:92fe965d-a189-4f26-844c-0979c6ca035e" : {
    "limit": 42,
    "active": true,
},
```

As defined, and leveraging ETCD's feature of searching by key prefix, the system also has direct access to all notifications for a user by searching only for prefix `notification:<USERNAME>`. This way post-processing was avoided.

#### 3.4.5 - Favourite

With the key in the format `favorite:<USERNAME>`, a single operation is sufficient to ensure the retrieval of all events marked as favorites by the user:

```json
"favourite:johndoe": [
    "92fe965d-a189-4f26-844c-0979c6ca035e",
    "ad25c85c-6714-4d1f-857b-9bcd1a45ccb9"
]
```

#### 3.4.6 - Purchase

Due to potential key collisions in a distributed context, indexing purchase keys by timestamp became unfeasible. Therefore, the purchase history of a user for an event can be queried using the key `purchase:<USERNAME>:<EVENT_ID>`. Example:

```json
"purchase:johndoe:ad25c85c-6714-4d1f-857b-9bcd1a45ccb9": [
    {
        "date": "2024-03-14 13:45:00",
        "tickets": [
            {
                 "type": "red",
                "quantity": "3"
            },
            {
                "type": "green",
                "quantity": "42"
            }
        ]
    }
]
```

A purchase is characterized by an array of transactions, each containing a timestamp and a list of purchased tickets. Since the event ID is already present in the key, redundancy was avoided by not including the event identification again here, as it already contains these tickets.

Just like in the case of notifications, leveraging ETCD's feature of searching by key prefix, the system also has direct access to all user purchases by searching only for the prefix `purchase:<USERNAME>`, without requiring post-processing.

#### 3.4.7 - Search

One of the features to explore in TickETCD is the search for events by string, type, and location. Since ETCD, being a key-value database, does not allow searching by values but only by keys, an inverted index was implemented:

```json
"search:text:some": [
    "92fe965d-a189-4f26-844c-0979c6ca035e",
    "ad25c85c-6714-4d1f-857b-9bcd1a45ccb9"
],

"search:type:concert": [
    "f2af5c43-7cad-49f8-88c1-2ff7e8fe8d81"
],

"search:location:lisbon": [
    "97636456-a096-4868-9dc1-aac79a22961c",
    "f2af5c43-7cad-49f8-88c1-2ff7e8fe8d81",
    "c78f3b62-9fc9-4f05-9651-61354d720edc"
]
```

As observed, the key is constructed based on the search type followed by the input, in the format `search:<SEARCH_TYPE>:<INPUT>`. Its value is always a list of events that owns these characteristics. This also requires initial processing and runtime processing of the strings that constitute the event, such as the name and description, something to emphasize in the limitations of this implementation.

The text search leverages ETCD's prefix search feature, allowing users to search not only for a single word but also for the prefix of that word and obtain the same results without additional computational cost.

#### 3.4.8 - Static data

To ensure and enforce system constraints, some static auxiliary structures have been added to the database. Examples:

```json
"event:locations": ["lisbon", "porto", "braga"],

"event:types": ["concert", "theater", "dance", "magic", "circus"],

"ticket:types": ["pink", "blue", "green", "red"],
```

Event locations, event types, and ticket types are frequently accessed structures, allowing for rapid data selection without the need for complex queries or additional post-processing. However, this adds more redundancy to the system.

### 3.5 - Architecture

The architecture of the prototype can be illustrated according to the schema present in the Figure [Y]:

![Architecture Design](...)

To simulate a distributed system and evaluate its capabilities, the project deployed a cluster comprising five interconnected ETCD nodes through an internal network using Docker containers. Furthermore, employing Docker as well, a web application powered by Node.js was created, featuring a frontend crafted using the Tailwind CSS framework. The Microsoft etcd3 library served as a server-side solution for interfacing the cluster and the web application.

After the dataset specified earlier is generated, there is the step of populating the cluster, which takes the most time. ETCD does not have the capability to receive data in bulk, so each key-value pair must be injected directly into the cluster independently and sequentially. Since this technology is fully replicated and the prototype requires many auxiliary structures, even with just 10 users and 10 events, it easily scales to around 400 key-value pairs, making the populate step slow.

The system is designed to allow manual querying of information in the database at any given time. Due to the absence of a proprietary querying language or a command line interface, a Python script consuming queries in JSON format is utilized for this purpose, directly injecting commands into the Docker containers using the HTTP API.

The setup and execution of all steps is aided and automated with the provided makefile.

After the setup is completed, the prototype allows access to various endpoints to perform tasks and test the functionalities related to the ETCD technology:

- `/`: Used for login or registration;
- `/home[?search=<INPUT>]`: Homepage. By default, it displays some events. If the user searches (using the search field), it shows the search results;
- `/admin`: Admin page displaying database cluster statistics, events, and event creation;
- `/profile?username=<USERNAME>`: Displays details of a user profile, favourite events and last purchases;
- `/notifications`: Displays the current user notifications;
- `/event?id=<ID>`: Displays details of an event;
- `/tickets?eventid=<ID>`: Used for purchasing tickets;

Given that the database is a distributed cluster of five nodes, the architecture allows for the shutdown of up to two of these nodes, and the system remains intact and fully functional. This is a feature to be explored in the following sections.

### 3.6 - Features

Na secção seguinte serão analisadas as funcionalidades implementadas em TickETCD, de forma a testar as capacidades mas também as fragilidades da tecnologia ETCD bem como de um modo geral o próprio paradigma key-value.

#### 3.6.1 - Data processing

Ver Searching, por exemplo

#### 3.6.2 - Queries

Como indicado em previous sections, duas das principais 
Ver M2

#### 3.6.3 - Specific Features

- prefix (na realidade é getAll() mas que não tem custo grande por é de replicação total, logo dá para fazer isto)
- notifications (como o etcd é )
- cluster/node saúde

Atenção: ativação de notifications ou até info de clusters NÃO CONTA COMO QUERY, pois é a partir apenas da ETCD API, não propriamente um acesso aos dados colocados lá.

#### 3.7 - Limitations

Although ETCD is suitable for most cases explored in the TickETCD prototype, there are situations where an implementation with another NoSQL paradigm or even a relational mode would be more favorable.

The dataset used is indeed very redundant, ensuring a proper establishment of all the relationships proposed in the Conceptual Data Model and minimizing post-processing by the application, since there are only GET and PUT operations. Therefore, even with a reduced number of users, tickets, and events, it easily scales to hundreds of key-value pairs. A relational approach would be much more efficient in terms of space, but it would also require further processing by the application, which is suppressed in the case of key-value pairs with the addition of this redundancy.

The entire dataset must then be fully-replicated, impacting the system response time on any request to update values in the database. In case of ticket sales, the processing speed of the system would also be a factor to consider when choosing this technology.

ETCD does not have the capability to receive data in bulk, so each key-value pair must be injected directly into the cluster independently and sequentially. Given the exponential growth of key-values, this becomes a slow process. In real-world cases where ETCD is used, for example in Kubernetes for configuration maintenance, this is not a relevant issue because configurations are mostly finite, small in size, and do not grow much. On the other hand, since TickETCD is a web application for ticket sales management, the initial setup becomes a limiting factor of the system.

Unlike other key-value paradigm technologies, ETCD does not support additional data types in the value of each key beyond strings. This brought a significant limitation in terms of processing objects and the design of the Physical Data Model itself. There are cases in the system where this difficulty could have been overcome by adding extra redundancy, as explained in the following example:

```json
"user:johndoe": { 
    "name": "jonh doe", 
    "email": "john@mail.com", 
    "password": "john123", 
    "role": "admin"
}

"user:johndoe:name": "jonh doe"
"user:johndoe:email": "john@mail.com"
"user:johndoe:password": "john123"
"user:johndoe:role": "admin"
```

This would avoid resorting to serialization and deserialization of objects at runtime, before and after accessing the database. However, the first strategy was adopted in the prototype for two main reasons. On one hand, this example cannot be generalized for all the application's needs. In cases like the Favorite aggregate, for spatial efficiency reasons, the value would have to be an array with the IDs of the favorite events, otherwise we would have a key of the format `favorite:johndoe:<EVENT_ID>` with a boolean value for all username-event combinations or only for true combinations. In either case, to discover the set of favorite events for a user, as many queries as events in the system would have to be performed. In the case of creating the Purchase aggregate, it is even more harmful, since it is impossible, in a concurrent context, to create keys based on timestamps due to probable key collisions. On the other hand, the approach with more redundancy is not scalable, as for a simple aggregate with N attributes, it would result in N queries to the system and subsequent processing of its data. Therefore, it is always necessary to resort to auxiliary data structures, such as arrays and objects, to meet the application's needs. Given these constraints of the system, and even though there is no solution capable of addressing the tradeoff exposed, the approach with a query and subsequent serialization/deserialization is more suitable for TickETCD.

Still within the realm of efficient computing, like any key-value paradigm database, ETCD does not allow direct access to the attributes of the manipulated values. This results in a very large overhead when the system needs to compute statistics with those attributes. The statistics feature was developed in TickETCD to illustrate this difficulty. Computing a series of visual statistics about the events such as revenue or sales distribution by ticket type was achieved using a lot of external computation. In a system driven by a relational database with support for traditional SQL and operations like AVG, SUM, the task was performed directly within the database system.
As such, searching for attributes of various aggregates in TickETCD was compromised and reduced to a tiny fraction of what could be expected in a ticket sales system.

The full-text search feature for events based on their attributes had to resort to external pre-computation of inverted indexes outside of ETCD to ensure its correct implementation. This caused extreme overhead in processing the name and description strings of the events, as well as the creation of a number of keys equal to the number of different words found throughout the system. This solution is not viable and could be addressed, for example, by using a relational approach with the LIKE operator or even substring search of attributes offered by most databases in the document-based paradigm.

This was the biggest functionality bottleneck encountered in TickETCD considering the purpose of the application and led to the decision not to implement a way to update event data. In fact, a modification to these attributes would trigger a delete of all references to the event's words in all auxiliary structures and subsequent computation of all affected inverted indexes. This update would cause extreme overhead that was chosen not to be supported in this prototype.

- Transactions limitadas ou inexistentes. Casos onde o protótipo se dá mal. Propriedades ACID

## 4. Conclusion

With the development of this project, we were able to explore in greater depth one of the non-relational database paradigms currently in use, key-value. We had the opportunity to work with a new technology, ETCD, which allowed us to get to know its specificities and the cases in which this type of tool is most suitable for use, since its entire design is very focused on configurations of distributed systems and platforms where it is essential that there is strong consistency between the nodes of the cluster.
In this way, we have been able to understand how this type of approach, more specifically through ETCD, the characteristics that these databases provide in terms of scalability and consistency, since nowadays with the amount of data and operations that need to be carried out these are fundamental characteristics to be guaranteed by the platforms.


## References

-
-
-
-
-

## Annexes

- 
- 
- 
- 
- 
