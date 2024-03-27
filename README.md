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
NUM_USERS = 50
NUM_EVENTS = 20

# Probabilidade de um evento ser marcado como favorito
FAVOURITE_PROBABILITY = 0.3

# Acrescentar ou remover fields de acordo com o que 
# queremos que seja alvo de pesquisa nos eventos
EVENT_SEARCH_FIELDS = ['name', 'description', 'location']
```

Atualmente há geração completa dos seguintes agregados:

- `User` (username, user, email, password, role);
- `Event` (id, name, description, location);

E há geração das seguintes relações:

- `Favourite` (entre um user e eventos)

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