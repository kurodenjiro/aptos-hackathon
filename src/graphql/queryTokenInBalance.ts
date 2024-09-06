export const queryTokenBalance = `
query TokenInBalance($address: string) {
  current_fungible_asset_balances(
    where: {owner_address: {_eq: $address}}
  ) {
    owner_address
    amount
    storage_id
    last_transaction_version
    last_transaction_timestamp
    is_frozen
    metadata {
      asset_type
      creator_address
      decimals
      icon_uri
      name
      project_uri
      symbol
      token_standard
      maximum_v2
      supply_v2
    }
  }
}

`;