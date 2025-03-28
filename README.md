```gql
mutation Create_guests {
  create_guests(payload: { min: 11, max: 99 }) {
    max
    min
  }
}

query Read_guests {
  read_guests(payload: { id: "e636d683-d66f-47c9-887d-fe5429785068" }) {
    id
    max
    min
  }
}

mutation Update_guests {
  update_guests(
    payload: { id: "e636d683-d66f-47c9-887d-fe5429785068", max: 48, min: 6 }
  ) {
    id
    min
    max
    updatedAt
  }
}

mutation Delete_guests {
  delete_guests(payload: { id: "e636d683-d66f-47c9-887d-fe5429785068" }) {
    id
  }
}
```
