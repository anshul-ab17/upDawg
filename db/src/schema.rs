// @generated automatically by Diesel CLI.

diesel::table! {
    region (id) {
        id -> Text,
        name -> Text,
    }
}

diesel::table! {
    user (id) {
        id -> Text,
        username -> Text,
        password -> Text,
    }
}

diesel::table! {
    website (id) {
        id -> Text,
        url -> Text,
        time_added -> Timestamp,
        user_id -> Text,
    }
}

diesel::table! {
    website_tick (id) {
        id -> Text,
        response_time -> Int4,
        status -> Text,
        region_id -> Text,
        website_id -> Text,
        createdat -> Timestamp,
    }
}

diesel::joinable!(website -> user (user_id));
diesel::joinable!(website_tick -> region (region_id));
diesel::joinable!(website_tick -> website (website_id));

diesel::allow_tables_to_appear_in_same_query!(region, user, website, website_tick,);
