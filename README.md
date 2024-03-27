# TickETCD - BDNR Project

- [Run](#run)
- [Endpoints](#endpoints)
- [API](#api)
- [Data & Keys](#data--keys)

## Run

O projecto está disponível apenas em Docker:

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

Os dados gerados seguem as configurações presentes no header do ficheiro `generate.py`:

```python
NUM_USERS = 10
NUM_EVENTS = 10

FAVOURITE_PROBABILITY = 0.3         # Probability that a user marks an event as favorite given the event
EVENT_PURCHASE_LIMIT = 3            # Maximum number of times a user purchases from the same event
EVENT_PURCHASE_PROBABILITY = 0.5    # Probability that a user purchases any ticket given the event
TICKET_PURCHASE_PROBABILITY = 0.5   # Probability that a user purchases a specific type of ticket

EVENT_SEARCH_FIELDS = ['name', 'description', 'location']

EVENT_TYPES = ['Concert', 'Theater', 'Dance', 'Magic', 'Circus']

TICKET_TYPES = {
    'pink': { 'minPrice': 100, 'maxPrice': 200, 'minQuantity': 10, 'maxQuantity': 100 },
    'yellow': { 'minPrice': 200, 'maxPrice': 350, 'minQuantity': 80, 'maxQuantity': 100 },
    'green': { 'minPrice': 70, 'maxPrice': 80, 'minQuantity': 50, 'maxQuantity': 500 },
    'red': { 'minPrice': 50, 'maxPrice': 70, 'minQuantity': 100, 'maxQuantity': 600 },
}
```

Atualmente há geração completa dos seguintes agregados:

- `User` (username, user, email, password, role);
- `Event` (id, name, description, location, type, date, current_quantity);
- `Ticket` (total_quantity, current_quantity, price);

E há geração das seguintes relações:

- `Favourite` (entre um user e eventos);
- `Search Event` (event string index);
- `Purchase` (entre um user e um evento);
- `Notification` (entre um user e um evento);

### Keys

As keys seguem uma formatação rígida:

```json
{
    // User
    "user:<USERNAME>": { 
        "name": "something", 
        "username": "something", 
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

    // Search Events
    "search:event:<WORD>": [
        "EVENT_ID_1",
        "EVENT_ID_2",
        "EVENT_ID_3",
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