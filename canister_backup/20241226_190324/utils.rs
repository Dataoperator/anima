use candid::Principal;
use crate::types::AnimaNFT;

pub fn is_valid_owner(anima: &AnimaNFT, owner: &Principal) -> bool {
    anima.owner == *owner || anima.approved_address.map_or(false, |approved| approved == *owner)
}