# Milestone 2 Notes

User (name, email)
Purchase (quantity, date)
Event (name, location, date, number_of_tickets_total, type, description, number_of_tickets_current)
Ticket (price)

User 1 --------- * Purchase * ---------- 1 Ticket * --------- 1 Event 

TickETCD

Milestone 2 - Coisas para fazer:

M2: Presentation of the (1) conceptual data model (in UML); (2) the queries, i.e. how data will be accessed by the application; and (3) the proposed aggregates.

Read, write, update and delete operations;
Lookups based on keys and individual attributes;
Operations over multiples aggregates;
Aggregation and projection operations (e.g. total orders per customer; monthly sales per product);
Keyword-based search over text fields (e.g. full-text search);

------

/  -> login (username, password) or register (email, username, password)
/home -> homepage, com lista dos eventos disponíveis, links para cada um, **pesquisa por nome de evento**
/event?id=<number> -> ...event, purchase button with quantity (default = 1), redirect para o evento
/profile?id=<username> -> ...profile, compras por ordem de data, **cancelar bilhetes**
/admin -> estatísticas gerais, total revenue for event / type of event, **edit número de bilhetes, criação de eventos, notificações de compras do evento X, promoções**;

## References

- https://kdmalviyan.medium.com/how-etcd-enables-consistent-and-reliable-data-storage-for-kubernetes-2d2bf3a1ef63
- https://docs.openshift.com/container-platform/4.13/scalability_and_performance/recommended-performance-scale-practices/recommended-etcd-practices.html