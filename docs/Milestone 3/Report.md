# ECTD Report

- Fábio
- Inês
- Bano

## Abstract

## 1 - Introduction

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

#### 2.2.1 - Consistency features

ETCD provides sequential consistency, which is the stronger form of consistency that can be obtained in distributed systems. This means that, independently of the node of the cluster that receives the request from the client, it reads the same events in the same order.
(https://etcd.io/docs/v3.3/learning/api_guarantees/)

#### 2.2.2 - Replication features
This database works in a distributed form, that is, it's a cluster of machines (nodes). Each node has a copy of the data, and the data is replicated across the cluster. This means that, if a node fails, the data is still available on the other nodes.
In ETCD there is a total replication of the data.
ETCD is built on the Raft consensus algorithm to ensure data store consistency across all nodes in a cluster—table stakes for a fault-tolerant distributed system. (https://www.ibm.com/topics/etcd)

#### 2.2.3 - Watcher feature
ETCD provides a functionality called watcher. this watcher can be used to monitor a given key-value pair over time based on the operations executed over that key.
It can be especified if we want to monitor only the PUT, only the GET operations, or both, depending of the problem.

#### 2.2.4 - Data processing features

- For example, map-reduce support

### 2.3 - Data Model
The data model can be seen in a logical and physical way

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

