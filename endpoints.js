const endpoints =
    [
        {
            "/": {
                params: "none",
                method: "GET",
                use: "used for server check",
            }
        }
        , {
            "Auth": {

                "/api/auth/createuser'": {
                    params: "name, username, email, password",
                    method: "POST",
                    use: "Create new User",
                    return: "jwt token"
                },
                "/api/auth/login'": {
                    params: "email, password",
                    method: "POST",
                    use: "Login User",
                    return: "jwt token"
                },
                "/api/auth/getuser'": {
                    params: "auth-token in header, auth-token: jwt token",
                    method: "POST",
                    use: "Get loggein user details",
                    return: "json"
                },
                "/api/auth/getusername'": {
                    params: "auth-token in header, auth-token: jwt token",
                    method: "POST",
                    use: "Get loggein user name",
                    return: "json"
                },
                "/api/auth/getuser'": {
                    params: "auth-token in header, auth-token: jwt token",
                    method: "POST",
                    use: "Get loggein user details",
                    return: "jwt token"
                },
            },
        }
        , {
            "Surveys": {
                "/api/survey": {
                    params: "",
                    method: "GET",
                    use: "Endpoint check",
                    return: ""
                },
                "/api/survey/getquestions": {
                    params: "",
                    method: "GET",
                    use: "Get all the questions",
                    return: ""
                },
                "/api/survey/createsurvey": {
                    params: "user login required - takes name,desc",
                    method: "POST",
                    use: "Endpoint check",
                    return: "Survey ID"
                },
                "/api/survey/question/:id": {
                    params: "",
                    method: "GET",
                    use: "Get question from id and fetch the associated answers ",
                    return: "{ question, answers }"
                },
                "/api/survey/answer/:id": {
                    params: "user login required - takes answer",
                    method: "POST",
                    use: "Post answer to the specific id of question",
                    return: "saved answer"
                },
                "/api/survey/mysurveys": {
                    params: "user login required",
                    method: "GET",
                    use: "Return all the surveys of loggedin user",
                    return: "{ surveys }"
                },
                "/api/survey/myquestions": {
                    params: "user login required ",
                    method: "GET",
                    use: "Return all the Questions of loggedin user",
                    return: "{ myquestions }"
                },
                "/api/survey/deletesurvey/:id": {
                    params: "user login required ",
                    method: "DELETE",
                    use: "Delete Survey by id",
                    return: "{ message: 'Survey deleted' }"
                },
                "/api/survey/deletequestion/:id": {
                    params: "user login required ",
                    method: "DELETE",
                    use: "Delete Question by id",
                    return: "{ message: 'Question deleted' }"
                },
            },
        }
        ,
    ]




