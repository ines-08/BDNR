apontamentos em cada tópico

2

falta referências à história, open/closed licensing model, comunidade, grupos, qualidade da documentação e justificação.
falta também a justificação da proveniência do seu curioso nome.
É muito bem pensado falar do CAP aqui. Mas o que é? Explicar brevemente, e adicionando uma referência.

2.1

Melhor retirar "As an example, ETCD is used in Kubernetes.". Fica melhor no ponto dos use cases, explorando minimamente o que são Kubernetes.

2.2.1

ETCD não funciona em distributed way, mas pode funcionar em distributed way usando clusters. É diferente.
O número de nós não é sempre ímpar, mas deve ser ímpar por motivos de gestão de recursos. É diferente. A justificação está mais ou menos no final desta secção, pode ser colocada aqui já que se fala no assunto.
"These nodes do not need to be physically together" -> há nodes pertencentes ao mesmo cluster mas fisicamente separados? 
Está explicado a característica de full-replication, mas nunca é dado este nome técnico.
"This means that, if a node fails, the data is still available on the other nodes.". Certo. Convém referir que isto acontece mesmo quando o leader morre e não existe por isso um ponto único de falha. Convém referir que só falha quando existe uma maioria dos nós mortos.
"have a consensus between all nodes about the values that are being stored in the database, taking into account that one or more nodes may fail". Consenso entre todos os nós ou só aqueles que estão vivos? Não deveria ser da maioria dos nós em vez de todos?

2.2.2

Referir que não é usada uma eventual consistency, pois tratando-se de algo usado para gerir configurações, ter nalgum momento nós com dados inconsistentes poderia provocar danos em sistemas críticos.

2.2.3

Um watcher não monitora mudanças na key-value, apenas monitora mudanças do value de uma key, já que a chave é imutável. Operações sob o valor, não chave.
Justificar o porquê de ser importante este tipo de feature no contexto de utilização de ETCD.

2.2.4

Não usamos nenhum método .json() e esses métodos dependem da linguagem de programação usada. A forma correcta é dizer serialização e desserialização de objectos em strings.

2.3

Retiraria o shortly. Dá a sensação que queremos ter menos trabalho.

2.3.1

Deve haver esquemas ilustrativos na documentação disto. É importante colocá-las para demonstrar o mecanismo.

2.3.2



----

NÃO ESQUECER

ETCD oferece uma HTTP API para ver a saúde dos nós do cluster, assim como algumas características:

- 
- 
- 
- 
- 

Isto dá o mote para ser explorado no protótipo.

Outra coisa, falar do prefix feature.

