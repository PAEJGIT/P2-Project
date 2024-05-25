const log = require('../utils/log');
const login = require('../user/login').login
const register = require('../user/register').register

function IntegrationTest() {
    let username = "Integration_Test_Username";
    let password = "Integration_Test_Password";

    log.info(__filename, 'IntegrationTest', 'INFO', 'Register Function Test', true, true, true);

    register(username, password, (data) => {
        if(data.success === true) {
            log.success("register function", "SUCCESS", "Succesfully Registered A User");

            log.info(__filename, 'IntegrationTest', 'INFO', 'Login Function Test', true, true, true);

            login(username, password, (data) => {
                if(data.success === true) {
                    log.success("login function", "SUCCESS", "Succesfully Logged In A User");

                    log.info(__filename, 'IntegrationTest', 'INFO', 'Register Existing User Test', true, true, true);

                    register(username, password, (data) => {
                        if(data.success === true) {
                            log.error("register function", "ERROR", "Registered An Existing User, Which Shouldnt Be Possible");
                        } else {
                            log.success("register function", "SUCCESS", "Failed To Register An Existing User");
                        }
                    })

                } else {
                    log.error("login function", "ERROR", "Failed To Login A User");
                }
            })

        } else {
            log.error("register function", "ERROR", "Failed To Registered A User");
        }
    })
}

IntegrationTest();