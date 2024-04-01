# TickETCD - BDNR Project

- [Run](#run)
    - [Dev](#dev)
    - [Docker](#docker)
- [Endpoints](#endpoints)
- [API](#api)
- [Data & Keys](#data--keys)

## Run

### Dev

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
- `/home[?search=<SOMETHING>]`, para a homepage. Por default são apresentados alguns eventos, caso o utilizador pesquise (search field), são apresentados os seus resultados;
- `/profile?username=<USERNAME>`, para apresentação dos detalhes de um profile;
- `/event?id=<ID>`, para apresentação dos detalhes de um evento;

## API

- `/api/search?input=<INPUT>`, retorna os detalhes dos eventos em JSON que têm textos que fazem match total ou parcial com INPUT;

## Data & Keys

### Data

Os dados gerados seguem as configurações em `configuration.json`:

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
    "EVENT_LOCATIONS": [
      "London",
      "Manchester",
      //...
    ],
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

### Keys

As keys seguem uma formatação rígida:

```json
{
    // User
    "user:<USERNAME>": { 
        "name": "something", 
        "email": "something", 
        "password": "something", 
        "role": "something"
    },

    // Event
    "event:<ID>": {
        "name": "something", 
        "description": "something", 
        "location": "something",
        "type": "something",
        "date": "something",
        "current_quantity": "something",
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
        "total_quantity": "something", 
        "current_quantity": "something", 
        "price": "something",
    },

    // Purchase
    "purchase:<USERNAME>:<EVENT_ID>": [
        {
            "date": "something",
            "tickets": [
                {
                    "type": "something",
                    "quantity": "something",
                },
                {
                    "type": "something",
                    "quantity": "something",
                },
            ]
        },
    ],

    // Notification
    "notification:<USERNAME>:<EVENT_ID>" : "quantity"
}
```