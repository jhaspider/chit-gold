const helpers = {
  err: {
    post_method_only: { status: false, msg: "Err : Only post request allowed" },
    session_key_missing: { status: false, msg: "Err : Session Key is Missing" },
    not_valid_session: { status: false, msg: "Err : Not a valid session" },
    search_term_missing: { status: false, msg: "Err : Search Term is missing" },
    get_method_only: { status: false, msg: "Err : Only get request allowed" },
    search_id_missing: { status: false, msg: "Err : Search Id parameter is missing" },
    search_id_not_found: { status: false, msg: "Err : Search Id not found" },
    required_param_missing: { status: false, msg: "Err : Required parameter missing" },
    put_method_only: { status: false, msg: "Only PUT request allowed" },
    delete_method_only: { status: false, msg: "Only Delete method allowed" },
    not_authorised: { status: false, msg: "Not authorised for collection creation" },
    unknown_error: { status: false, msg: "Something broke. We are looking into it " },
    topic_id_missing: { status: false, msg: "Topic Id is missing" },
  },
  capsFirstLetter: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
};

module.exports = helpers;
