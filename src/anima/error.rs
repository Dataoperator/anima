use candid::{CandidType, Deserialize};
use ic_stable_structures::{Storable, BoundedStorable};
use std::borrow::Cow;

#[derive(CandidType, Deserialize, Debug)]
pub enum AnimaError {
    NotFound,
    NotAuthorized,
    InteractionFailed(String),
    InternalError(String),
}

impl std::fmt::Display for AnimaError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AnimaError::NotFound => write!(f, "Anima not found"),
            AnimaError::NotAuthorized => write!(f, "Not authorized to interact with this Anima"),
            AnimaError::InteractionFailed(msg) => write!(f, "Interaction failed: {}", msg),
            AnimaError::InternalError(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl Storable for AnimaError {
    fn to_bytes(&self) -> Cow<[u8]> {
        let mut bytes = vec![];
        ciborium::ser::into_writer(&self, &mut bytes).unwrap();
        Cow::Owned(bytes)
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        ciborium::de::from_reader(bytes.as_ref()).unwrap()
    }
}

impl BoundedStorable for AnimaError {
    const MAX_SIZE: u32 = 1024;
    const IS_FIXED_SIZE: bool = false;
}