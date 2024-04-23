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

### 2.2 - Features

armazenamento, utilização, 

#### 2.2.1 - Consistency features

#### 2.2.2 - Replication features

#### 2.2.3 - Data processing features

- For example, map-reduce support

#### 2.2.4 - Consistency features

### 2.3 - Data Model

### 2.4 - Supported Data Operations

### 2.5 - Use Cases

### 2.6 - Problematic Scenarios

### 2.7 - ECTD vs. Other Solutions

- advantages and drawbacks noutras key-value solutions

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

