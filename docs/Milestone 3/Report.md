# ECTD Report

- Fábio Sá, up202007658@up.pt
- Inês Gaspar, up202007210@up.pt
- José Gaspar, up202008561@up.pt

## Abstract

The present report aims to explore, both theoretically and practically, the ETCD technology, a non-relational database using key-value paradigm.

Throughout the document, characteristics of the technology are presented, as well as its specificities and use cases. Next, a specific scenario is addressed, along with the strategies supporting the solution found. Finally, the implementation of the prototype using ETCD is explained, considering the aforementioned ideation, ETCD characteristics and some considerations of features in this paradigm.

## 1 - Introduction

O aumento da quantidade de dados levou à criação de novas soluções para tornar o armazenamento mais eficiente: bases de dados não relacionais.
Desta forma, surgiu o paradigma explorado neste relatório, key-value através da abordagem com a ETCD.

Este tipo de base de dados key-value tem um design muito simples e de aprendizagem rápida, uma vez que apenas depende do desenho da key e todo o processamento e manipulação necessária fica do lado da aplicação. Estas tecnologias de NoSQL permitem uma grande escalabilidade e melhor performance em relação às bases de dados relacionais.
A ETCD é uma base de dados frequentemente utilizada para configuração de sistemas de clusters. É especialmente usada por causa da forte consistência entre nós que permite, e que vai explorado nas próximas secções, assim através dos use cases desta tecnologia e do protótipo desenvolvido.

## 2 - Techonology

### 2.1 - Overview

- ETCD é uma key-value store. O que são key-values stores? Fazer um pequeno background.
- Em que posição está nas db-engines.com?
- History
- Licencing Model
- Community (quer ligadas ao projecto, quer externas)
- Documentation (existencia, qualidade)


Key-value stores are a type of NoSQL database that stores data as a collection of key-value pairs, where each key is unique and associated with a single value. These databases are designed for high-speed retrieval and simple data models. Key-value stores are commonly used for caching, session management, and storing user preferences.

ETCD, developed by CoreOS, is a distributed key-value store that is widely used for configuration management, service discovery, and coordination in distributed systems. It provides a reliable way to store data across a cluster of machines and ensures strong consistency guarantees. Unlike most other NoSQL databases, ETCD is designed to be highly available and fault-tolerant, making it a popular choice for storing data in distributed systems. As specified by the CAP theorem, in order to achieve strong consistency, ETCD must sacrifice performance, which makes it not ideal for projects where the time of execution is crucial.

### 2.2 - Features

As it is going to be described throughout this section, ETCD has several features, some of them unique, that make this database a good choice in many distributed systems. As an example, ETCD is used in Kubernetes.

#### 2.2.1 - Replication and node communication features
This database works in a distributed way, that is, it's a cluster of machines (nodes). In etcd the number of nodes is always odd (1, 3, 5, etc). These nodes do not need to be physically together. Etcd basically stablishes connection between nodes via TLS. If the IP of the node is not known, etcd has a "discovery mode" that will find the node's IP address and establish the connection.
Even though it is possible to have multiple nodes in one cluster, etcd does not provide a way to support multiple clusters that can communicate with each other. To implement that feature, some communication protocol must be implemented between the clusters. One approach would be to put the leader node of each cluster in charge of that communication.
Each node has a copy of the data, and the data is replicated across the cluster. This means that, if a node fails, the data is still available on the other nodes.
In ETCD there is a total replication of the data.
ETCD is built on the Raft consensus algorithm to ensure data store consistency across all nodes in a cluster—table stakes for a fault-tolerant distributed system. This algorithm is based on quorums and as the name suggests it is used to have a consensus between all nodes about the values that are being stored in the database, taking into account that one or more nodes may fail. In etcd, for a cluster with n members, the quorum size is (n/2)+1. For any odd-sized cluster, adding one node will always increase the number of nodes necessary for quorum.
(https://www.ibm.com/topics/etcd)
(https://etcd.io/docs/v3.4/op-guide/clustering/)
(https://etcd.io/docs/v3.3/faq/)
(https://raft.github.io/)

#### 2.2.2 - Consistency features

ETCD provides sequential consistency, which is the stronger form of consistency that can be obtained in distributed systems. This means that, independently of the node of the cluster that receives the request from the client, it reads the same events in the same order.

Consistency is one of the advantages of using a distributed database. It allows for multiple nodes to be updated at the same time, which can lead to inconsistencies in the data. To avoid this, ETCD provides a quorum like strategy, which ensures that the data is consistent across all nodes in the cluster even if some nodes are down at that given moment.
(https://etcd.io/docs/v3.3/learning/api_guarantees/)

#### 2.2.3 - Watcher feature
ETCD provides a functionality called watcher. this watcher can be used to monitor a given key-value pair over time based on the operations executed over that key.
It can be especified if we want to monitor only the PUT, only the GET operations, or both, depending of the problem.

#### 2.2.4 - Data processing features

- For example, map-reduce support

Regarding data processing features, etcd does not provide much. As an example, functions like counts, sums, averages, map-reduces that are supported by other databases have no translation in etcd, making mandatory to process information after querying the database.
As it can be seen in the oficial documentation of etcd, the main features supported by etcd are methods to read, write and delete data, besides the ability to monitor changes in a given key-value pair plus the possibility of knowing the version of the key (version is required internally to achieve consistency in a distributed system) and seeing old values for a given key.

However, it is not only in data processing features that etcd is not ideal, also on the data types that can be stored in etcd. These types consist in strings and numbers, so there are no lists, sets or more complex data types.
To bypass this limitation, one possible approach (implemented on the demo that is going to be described later on this report) is to use functions like ".json()" and ".stringify()". With those functions we can transform a list or any other data type into a string, and then store it in etcd.

( https://etcd.io/docs/v3.6/dev-guide/interacting_v3/ )

### 2.3 - Data Model
The data model can be seen in a logical and physical way. Throughout this section both of them are going to be described shortly.

#### 2.3.1 - Logical View
The store's logical view is a flat binary key space with a lexically sorted index for efficient range queries. It maintains multiple revisions, with each atomic mutative operation creating a new revision. Old versions of keys remain accessible through previous revisions, and revisions are indexed for efficient ranging. Revisions are monotonically increasing over time.

A key's life spans a generation from creation to deletion, with each key having one or multiple generations. Creating a key increments its version, starting at 1 if it doesn't exist. Deleting a key generates a tombstone, resetting its version to 0. Each modification increments a key's version within its generation. Compaction removes old generations and values except the latest one.

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
### 2.7 - ECTD vs. Other Solutions

- advantages and drawbacks noutras key-value solutions

As previously mentioned, ETCD is not like most key-value databases. It is recommended to be used when sequential consistency is needed, in distributed systems, and not to be used as a cache, like Redis, for example. There is a tradeoff between having a fast response time and having a consistent state. ETCD is made not to be fast but consistent while most key-value databases are made to be fast but not consistent.
The main advantage of ETCD is the ability of having more than one point of failure. Thanks to the leader election algorithms and the Raft consensus algorithm, if more than 50% of the nodes are up and running, the system will be able to continue working and accept new operations over the database. Then, when the nodes that fail recover, the state is fully replicated to those nodes achieving the sequential consistency that is needed and guaranteed by the API.
Other advantage, as specified in ETCD documentation, the maximum reliable database size of ETCD is of several gigabytes while others (e.g ZooKeeper and Consul) can support until hundreds of megabytes.
The main drawback is the performance of ETCD and the lack of ability of inserting larges amount of data in a block. Operations on database are restrict to one at a time.

### 2.8 - Benchmarking

## 3 - Prototype

### 3.1 - Topic

- Bilhetes. O porquê de ser adequado neste caso (porque a replicação é total).

## 3.2 - Conceptual Data Model

em UML

## 3.3 - Physical Data Model

modelo físico da tecnologi a utilizar

## 3.4 - Data Structures

- With illustrative values

## 3.6 - Architecture

arquitetura, flow diagram, incluindo configs e python, cluster e tal

## 3.7 - Features

### 3.7.1 - Data processing

### 3.7.2 - Queries

### 3.7.3 - Specific Features

- prefix (na realidade é getAll() mas que não tem custo grande por é de replicação total, logo dá para fazer isto)
- notifications (como o etcd é )
- cluster/node saúde

### 3.7.4 - Limitations

- Povoação não-em-bloco
- Transactions
- Pesquisa sem queries complexas (por timeline, por número de bilhetes..., por atributos no fundo)
- Updates de data structures, como da pesquisa;

## 4. Conclusion

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

