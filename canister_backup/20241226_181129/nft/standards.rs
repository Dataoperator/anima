//...previous content remains the same...

pub trait ICRC37 {
    fn icrc37_approve(&mut self, spender: Principal, token_ids: Vec<TokenIdentifier>, expires_at: Option<u64>, memo: Option<Vec<u8>>) -> Result<()>;
    fn icrc37_revoke(&mut self, spender: Principal, token_ids: Vec<TokenIdentifier>) -> Result<()>;
    fn icrc37_set_approval_for_all(&mut self, operator: Principal, approved: bool) -> Result<()>;
    fn icrc37_is_approved_for_all(&self, owner: Principal, operator: Principal) -> bool;
    fn icrc37_get_approved(&self, token_id: TokenIdentifier) -> Option<Principal>;
}

impl ICRC37 for TokenState {
    fn icrc37_approve(&mut self, spender: Principal, token_ids: Vec<TokenIdentifier>, expires_at: Option<u64>, memo: Option<Vec<u8>>) -> Result<()> {
        let caller = ic_cdk::api::caller();

        // Check for max approvals per tx if configured
        if let Some(max_batch) = self.collection.metadata.max_approvals_per_tx {
            if token_ids.len() as u32 > max_batch {
                return Err(Error::BatchLimitExceeded);
            }
        }

        // Validate ownership and process approvals
        for &token_id in &token_ids {
            let token = self.tokens.get(&token_id).ok_or(Error::TokenNotFound)?;
            
            if token.owner != caller {
                return Err(Error::NotAuthorized);
            }

            self.approvals.insert(
                (caller, token_id),
                ApprovalInfo {
                    spender,
                    expires_at,
                    memo: memo.clone(),
                }
            );

            self.add_transaction(Transaction {
                id: self.next_transaction_id,
                token_id,
                from: caller,
                to: spender,
                timestamp: time(),
                transaction_type: TransactionType::Approve,
                memo: memo.clone(),
                price: None,
                royalty_amount: None,
                royalty_recipient: None,
            });
        }

        Ok(())
    }

    fn icrc37_revoke(&mut self, spender: Principal, token_ids: Vec<TokenIdentifier>) -> Result<()> {
        let caller = ic_cdk::api::caller();

        for &token_id in &token_ids {
            let token = self.tokens.get(&token_id).ok_or(Error::TokenNotFound)?;
            
            if token.owner != caller {
                return Err(Error::NotAuthorized);
            }

            self.approvals.remove(&(caller, token_id));
            
            self.add_transaction(Transaction {
                id: self.next_transaction_id,
                token_id,
                from: caller,
                to: spender,
                timestamp: time(),
                transaction_type: TransactionType::Revoke,
                memo: None,
                price: None,
                royalty_amount: None,
                royalty_recipient: None,
            });
        }

        Ok(())
    }

    fn icrc37_set_approval_for_all(&mut self, operator: Principal, approved: bool) -> Result<()> {
        let caller = ic_cdk::api::caller();
        
        if approved {
            // Prevent self-approval
            if operator == caller {
                return Err(Error::SelfApproval);
            }

            // Add operator approval
            self.operator_approvals
                .entry(caller)
                .or_default()
                .insert(operator);

            self.add_transaction(Transaction {
                id: self.next_transaction_id,
                token_id: 0, // Not applicable for operator approval
                from: caller,
                to: operator,
                timestamp: time(),
                transaction_type: TransactionType::ApproveAll,
                memo: None,
                price: None,
                royalty_amount: None,
                royalty_recipient: None,
            });
        } else {
            // Remove operator approval
            if let Some(operators) = self.operator_approvals.get_mut(&caller) {
                operators.remove(&operator);
                
                self.add_transaction(Transaction {
                    id: self.next_transaction_id,
                    token_id: 0,
                    from: caller,
                    to: operator,
                    timestamp: time(),
                    transaction_type: TransactionType::RevokeAll,
                    memo: None,
                    price: None,
                    royalty_amount: None,
                    royalty_recipient: None,
                });
            }
        }

        Ok(())
    }

    fn icrc37_is_approved_for_all(&self, owner: Principal, operator: Principal) -> bool {
        self.operator_approvals
            .get(&owner)
            .map_or(false, |operators| operators.contains(&operator))
    }

    fn icrc37_get_approved(&self, token_id: TokenIdentifier) -> Option<Principal> {
        if let Some(token) = self.tokens.get(&token_id) {
            if let Some(approval_info) = self.approvals.get(&(token.owner, token_id)) {
                if approval_info.expires_at.map_or(true, |exp| exp > time()) {
                    return Some(approval_info.spender);
                }
            }
        }
        None
    }
}

// Helper trait for stable storage
pub trait StableState {
    type StableForm;
    fn to_stable(&self) -> Self::StableForm;
    fn from_stable(stable: Self::StableForm) -> Self;
}

impl StableState for TokenState {
    type StableForm = (
        Vec<(TokenIdentifier, AnimaToken)>,
        Vec<(Principal, Vec<TokenIdentifier>)>,
        CollectionMetadata,
        Vec<((Principal, TokenIdentifier), ApprovalInfo)>,
        Vec<(Principal, Vec<Principal>)>,
        RoyaltyConfig,
        Vec<Transaction>,
        u64,
        u64,
    );

    fn to_stable(&self) -> Self::StableForm {
        (
            self.tokens.iter().map(|(&k, v)| (k, v.clone())).collect(),
            self.owner_tokens.iter()
                .map(|(k, v)| (*k, v.iter().cloned().collect()))
                .collect(),
            self.collection.metadata.clone(),
            self.approvals.iter().map(|((p, t), v)| ((*p, *t), v.clone())).collect(),
            self.operator_approvals.iter()
                .map(|(k, v)| (*k, v.iter().cloned().collect()))
                .collect(),
            self.royalties.config.clone().unwrap_or_default(),
            self.transactions.clone(),
            self.next_token_id,
            self.next_transaction_id,
        )
    }

    fn from_stable(stable: Self::StableForm) -> Self {
        let (
            tokens,
            owner_tokens,
            collection_metadata,
            approvals,
            operator_approvals,
            royalty_config,
            transactions,
            next_token_id,
            next_transaction_id,
        ) = stable;

        let mut state = Self::new(collection_metadata, royalty_config);
        state.tokens = tokens.into_iter().collect();
        state.owner_tokens = owner_tokens.into_iter()
            .map(|(k, v)| (k, v.into_iter().collect()))
            .collect();
        state.approvals = approvals.into_iter().collect();
        state.operator_approvals = operator_approvals.into_iter()
            .map(|(k, v)| (k, v.into_iter().collect()))
            .collect();
        state.transactions = transactions;
        state.next_token_id = next_token_id;
        state.next_transaction_id = next_transaction_id;

        state
    }
}