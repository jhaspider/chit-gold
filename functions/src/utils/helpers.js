const helpers = {
  err: {
    post_method_only: "Err : Only post request allowed",
    session_key_missing: "Err : Session Key is Missing",
    not_valid_session: "Err : Not a valid session",
    search_term_missing: "Err : Search Term is missing",
    get_method_only: "Err : Only get request allowed",
    search_id_missing: "Err : Search Id parameter is missing",
    search_id_not_found: "Err : Search Id not found",
    required_param_missing: "Err : Required parameter missing",
    put_method_only: "Only PUT request allowed",
    delete_method_only: "Only Delete method allowed",
    not_authorised: "Not authorised for collection creation",
  },
  capsFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
};

module.exports = helpers;
