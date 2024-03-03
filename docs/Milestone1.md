# etcd

## History

etcd was initially developed by CoreOS for distributed concurrent control over OS upgrades in cluster management systems and the storage and distribution of configuration files. Therefore, etcd has been designed to provide high-availability, strong consistency and high-consistency small KVStore services.

etcd is currently affiliated with Cloud Native Computing Foundation (CNCF) and widely used by large Internet companies, such as Amazon Web Services (AWS), Google, Microsoft, and Alibaba.

etcd's first release was in 2013.

## Name origin

The name “etcd” originated from two ideas, the unix “/etc” folder and “d"istributed systems. The “/etc” folder is a place to store configuration data for a single system whereas etcd stores configuration information for large scale distributed systems. Hence, a “d"istributed “/etc” is “etcd”.

## Usages

- Manage a cluster of CoreOS Container Linux (original purpose);
- Configuration store of Kubernetes;
- Rook;

## Owner

In 2018, RedHat announced to acquire CoreOS, and IBM announced to acquire RedHat in the same year.
Long story short -> IBM.

## Characteristics

etcd is designed as a general substrate for large scale distributed systems. These are systems that will never tolerate split-brain operation and are willing to sacrifice availability to achieve this end. etcd stores metadata in a consistent and fault-tolerant way. An etcd cluster is meant to provide key-value storage with best of class stability, reliability, scalability and performance.

Distributed systems use etcd as a consistent key-value store for configuration management, service discovery, and coordinating distributed work.
Common distributed patterns using etcd include leader election, distributed locks, and monitoring machine liveness. It is recommended to have an odd number of members in a cluster. An odd-size cluster tolerates the same number of failures as an even-size cluster but with fewer nodes, based on Raft consensus algorithm.

## Why etcd?

- `Fully replicated`: every node in an etcd cluster has access the full data store.
- `Highly available`: etcd is designed to have no single point of failure and gracefully tolerate hardware failures and network partitions. The leader node is determined at run-time using the Raft algorithm.
- `Reliably consistent`: every data ‘read’ returns the latest data ‘write’ across all clusters.
- `Fast`: etcd has been benchmarked at 10,000 writes per second.
- `Secure`: etcd supports automatic Transport Layer Security (TLS) and optional secure socket layer (SSL) client certificate authentication. Because etcd stores vital and highly sensitive configuration data, administrators should implement role-based access controls within the deployment and ensure that team members interacting with etcd are limited to the least-privileged level of access necessary to perform their jobs.
- `Simple`: any application, from simple web apps to highly complex container orchestration engines such as Kubernetes, can read or write data to etcd using standard HTTP/JSON tools.

## ectd vs. Redis

| Feature                      | etcd                    | Redis                    |
|------------------------------|-------------------------|--------------------------|
| Memory                       | Disk                    | In-memory                      |
| Focus                        | Distributed system config | Database, cache          |
| Fault tolerance              | Strong                  | Limited                  |
| Failover mechanism           | Strong                  | Limited                  |
| Supported data types         | Limited                 | Wide range               |
| Read/write performance      | Slower                  | Faster                   |

## Pricing model

Free

## Licensing model

Open Source: https://github.com/etcd-io/etcd

## Documentation

The documentation seems to be very complete, with simple tutorials, demos and instructions for installation.
Link: https://etcd.io/docs/v3.5/

## Community

They have user and developer communities and several channels to communicate:

- `Google Groups`: forum to ask questions and get the latest news
- `Twitter`: for real time announcements, blogs, post
- `Github`: discussions

etcd contributors and maintainers meet online every week:

- Zoom Meetings
- Meeting docs
- Youtube

## References

- https://etcd.io
- https://www.ibm.com/topics/etcd
- https://dbdb.io/db/etcd
- https://medium.com/@extio/deep-dive-into-etcd-a-distributed-key-value-store-a6a7699d3abc

## Presentation M1

- https://docs.google.com/presentation/d/1UO1Tv8EVjFd6pS6Er3Z8K5P2ivaIGGvurXc6ijWiZf4/edit