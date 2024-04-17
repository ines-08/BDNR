# TickETCD - BDNR Project

- [Run](#run)
    - [Dev](#dev)
    - [Docker](#docker)
- [Endpoints](#endpoints)
- [Data](#data)
- [Queries](#queries)

## Run

### Dev -> DEPRECATE THIS STEP BEFORE SUBMISSION

```bash
$ cd src/
$ docker-compose -f docker-compose-dev.yml up -d
$ python3 /data/generate.py data/data.json
$ python3 /data/populate.py data/data.json
$ npm install
$ npm run
```

Só há um servidor disponível: [localhost:3001](http://localhost:3001) e à partida é só necessário inicializar os containers ETCD apenas uma vez, assim como a criação de dados e povoação.

### Docker

```bash
$ cd src/
$ make
```

O script irá:

- Parar e eliminar os anteriores containers, caso existam;
- Eliminar antigas versões da base de dados em /db, caso existam;
- Criar toda uma nova infraestrutura/containers do projecto: 5 nós ectd e 3 servers;
- Criar volumes /db/etcdX para todos os nós ETCD existentes no cluster;
- Instalar as dependências necessárias do Python para os passos seguintes;
- Gerar dados;
- Povoar o cluster com os dados gerados de forma paralela;

Os servidores estão disponíveis em [localhost:3001](http://localhost:3001), [localhost:3002](http://localhost:3002) ou [localhost:3003](http://localhost:3003).

## Endpoints 

- `/`, para login ou register;
- `/admin`, admin page, com estatísticas de base de dados, eventos e criação de eventos;
- `/home[?search=<SOMETHING>]`, para a homepage. Por default são apresentados alguns eventos, caso o utilizador pesquise (search field), são apresentados os seus resultados;
- `/profile?username=<USERNAME>`, para apresentação dos detalhes de um profile;
- `/event?id=<ID>`, para apresentação dos detalhes de um evento;
- `/tickets?eventid=<ID>`, para compra de bilhetes;
- `/api/search?input=<INPUT>`, retorna, em JSON, os detalhes dos eventos que têm textos (name, location ou description) que fazem match total ou parcial com a string INPUT;

## Data

Os dados gerados seguem as configurações descritas em `configuration.json`:

```json
{
    "NUM_USERS": 10,
    "NUM_EVENTS": 10,
    "ADMIN_PROBABILITY": 0.1,
    "FAVOURITE_PROBABILITY": 0.3,
    "EVENT_PURCHASE_LIMIT": 3,
    "EVENT_PURCHASE_PROBABILITY": 0.5,
    "TICKET_PURCHASE_PROBABILITY": 0.5,
    "NOTIFICATION_PROBABILITY": 0.3,
    "EVENT_SEARCH_FIELDS": ["name", "description", "location"],
    "EVENT_LOCATIONS": ["London", "Manchester" ],
    "EVENT_TYPES": ["concert", "theater", "dance", "magic", "circus"],
    "TICKET_TYPES": {
      "pink": {"minPrice": 100, "maxPrice": 200, "minQuantity": 10, "maxQuantity": 100},
      "yellow": {"minPrice": 200, "maxPrice": 350, "minQuantity": 80, "maxQuantity": 100},
      "green": {"minPrice": 70, "maxPrice": 80, "minQuantity": 50, "maxQuantity": 500},
      "red": {"minPrice": 50, "maxPrice": 70, "minQuantity": 100, "maxQuantity": 600}
    }
}
```

Atualmente há geração completa dos seguintes agregados:

- `User` (username, user, email, password, role);
- `Event` (id, name, description, location, type, date, current_quantity);
- `Ticket` (total_quantity, current_quantity, price);

E há geração das seguintes relações:

- `Favourite` (entre um user e eventos);
- `Search (text, type, location)` (event string indexes);
- `Purchase` (entre um user e um evento);
- `Notification` (entre um user e um evento);

Por motivos de eficiência, foram gerados também estas estruturas auxiliares:

- `ticket:types`: tipos possíveis para um evento;
- `event:types`: tipos possíveis para um evento;
- `event:locations`: localizações possíveis para um evento; 

Exemplos da formatação das key-value pairs usadas no projecto:

```json
{
    // User
    "user:<USERNAME>": { 
        "name": "user", 
        "email": "user@gmail.com", 
        "password": "user123", 
        "role": "admin"
    },

    // Event
    "event:<ID>": {
        "name": "event", 
        "description": "a simple event", 
        "location": "porto",
        "type": "concert",
        "date": "2024-02-13",
        "current_quantity": "14",
    },

    // Search Events by Text
    "search:text:<WORD>": [
        "EVENT_ID_1",
        "EVENT_ID_2",
    ],

    // Search Events by Type
    "search:type:<TYPE>": [
        "EVENT_ID_3",
        "EVENT_ID_4",
    ],

    // Search Events by Location
    "search:location:<LOCATION>": [
        "EVENT_ID_5",
        "EVENT_ID_6",
    ],

    // Favourite relationship
    "favourite:<USERNAME>": [
        "EVENT_ID_1",
        "EVENT_ID_2",
        "EVENT_ID_3",
    ],

    // Ticket
    "ticket:<EVENT_ID>:<TYPE>": {
        "total_quantity": "34", 
        "current_quantity": "23", 
        "price": "23.30",
    },

    // Purchase
    "purchase:<USERNAME>:<EVENT_ID>": [
        {
            "date": "2024-03-14 13:45:00",
            "tickets": [
                {
                    "type": "red",
                    "quantity": "3",
                },
                {
                    "type": "green",
                    "quantity": "42",
                },
            ]
        },
        {
            "date": "2024-03-16 02:40:00",
            "tickets": [
                {
                    "type": "pink",
                    "quantity": "45",
                },
                {
                    "type": "green",
                    "quantity": "78",
                },
            ]
        },
    ],

    // Notification
    "notification:<USERNAME>:<EVENT_ID>" : 82,

    // Static event locations
    "event:locations": ["A", "B", "C"],

    // Static event types
    "event:types": ["D", "E", "F", "G"],

    // Static ticket types
    "ticket:types": ["H", "I", "J"],
}
```

## Queries

Há também hipótese de correr algumas queries em modo externo ao protótipo. As queries estão descritas nesta estrutura de dados presente em `data/queries.py`:

```python
QUERIES = [
    { "description": "A simple put", "code": "put some thing", "output": False },
    { "description": "Getting all ticket types", "code": "get ticket:types", "output": True }
]
```

Depois dos containers da base de dados ficarem instanciados, as queries podem ser rodadas usando:

```bash
$ python3 data/queries.py
```