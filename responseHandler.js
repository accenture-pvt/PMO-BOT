const apiCaller = require("../apiHandler/apiCall");
const dbHandler = require("../handlers/databaseHandler");
const utils = require("../utils/util");
const logger = require("converse-logger");
const HashMap = require("hashmap");
const variableHandler = require("./variableHandler");
const { VM } = require("vm2");
const sandboxTimeout = require("config").get('app').sandBoxParam;
var file= require("./mongoDBHandler");

module.exports = {
  /**
   * @description - This retrieves the correct response in the flow based on the current context
   * @param {String} currentStep - The currentStep to be retrieved
   * @param {Object} nlpResponse - The NLP response object
   * @param {Object} conversationFlow - The retrieved flow that has been identified
   * @returns {Object} - The response object with text and/or response config
   */
  getResponse: async function (context, nlpResponse, conversationFlow) {
    let botResponse = null;
    if (conversationFlow && conversationFlow.flow) {
      logger.debug("Convesation flow exists");
     // console.log(nlpResponse.topIntent);
      const flows = conversationFlow.flow;
      // If we have an NLP Response we are looking for particular responses
      // Otherwise we are getting flows that do not require NLP e.g. Greetings or Incomprehension
      if (nlpResponse && nlpResponse.topIntent) {
        // We filter the flows to find only the user responses
        const userResponseFlows = flows.filter(function getObj(obj) {
          return obj.owner === "user";
        });
        // We look for the next steps from the user Node so we can get the correct bot response
        const nextSteps = findNextSteps(
          context,
          userResponseFlows,
          nlpResponse
        );
        // We filter the flows to find only the bot responses
        const botResponseFlows = flows.filter(function getObj(obj) {
          return obj.owner === "bot";
        });
        // We look for the next node in the flow based on intents and entities otherwise we return null and dispatch back to the Choreographer
        // As this bot cannot handle our request
        botResponse = nextSteps
          ? findBotResponse(nextSteps, nlpResponse, botResponseFlows)
          : null;
        // If we have a bot response and the node is to make a decision call we process here
        // Otherwise we send back the simple text response
        if (botResponse && botResponse.responseType === "variable") {
          let botConditionResponses = botResponseFlows.filter(function getObj(
            obj
          ) {
            return obj.owner === "bot" && obj.responseType === "conditionEval";
          });
          return this.processVariableDecision(
            context,
            botResponse,
            botResponseFlows,
            flows,
            botConditionResponses
          );
        } else {
//Start- Intent Certification
          if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="Certification")
          {
            let dbResponse = null;
            let getIntent = null;
            let getNameEntity = null;
            getIntent = nlpResponse.topIntent.intent;
            console.log("qqq"+getIntent);
            console.log("sssss"+context.converseContext.nlpResponse.entities);
            if(context.converseContext.nlpResponse.entities != null)
            {
            context.converseContext.nlpResponse.entities.forEach(function (entity) {
             // if(entity.entityName == "sys-person")
                getNameEntity = entity.entityValue;
                console.log("uu"+getNameEntity);

              });
            
              if(getNameEntity !=null){

              await file.intocalling(getNameEntity,getIntent).then(function(items) {
               dbResponse = items;
               logger.debug("SS"+dbResponse[1]);
             
             }, function(err) {
               console.error('The promise was rejected', err, err.stack);
             });
         
             //put all your stuffs here
             //change for count
             if(dbResponse[1]>0){

             
             let verbType = null;
             if(dbResponse[1]>1){
              verbType = "the details are";
             }else{
               verbType = "the detail is";
             }

            // botResponse.rsponse[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
            
           // botResponse.response[0] = "Happy to help "
           // botResponse.response[0] = "Number of certification/s found : " + dbResponse[1] + " and " +verbType + "\n " + dbResponse[0];
//botResponse.response[0] = getNameEntity + " did " + dbResponse[1] + " certification/s and " + verbType + "\n "  + dbResponse[0]; 
           botResponse.response[0] = getNameEntity + " did " + dbResponse[1] + " certification/s and " + verbType + "\n " + "<table style='width:100%' border='1'><tr> <th style='width:10%'>S.NO</th> <th style='padding-left:5px;width:30%'>Name</th> <th style='padding-left:5px;width:30%'>Completion Date</th> <th style='padding-left:5px;width:30%'>Valid till</th></tr>" + dbResponse[0] + "</table>";
            //botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
          //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Certification details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
             
            }else{
              botResponse.response[0] = "Sorry, we did not find any details.";
             // botResponse.response[0] = botResponse.response[0]+"\n Thank you.\n\n Please ask if you have any other query related to Certification details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }
          }
        }else{
             botResponse.response[0] = "please enter a valid enterprise id";
         }
        }
        //intent certification -end
        
        
         //Start- Intent SupervisorDetails
         if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="supervisorDetails")
         {
           let dbResponse = null;
           let getIntent = null;
           let getNameEntity = null;
           getIntent = nlpResponse.topIntent.intent;
           console.log("qqq"+getIntent);
           console.log("sssss"+context.converseContext.nlpResponse.entities);
           if(context.converseContext.nlpResponse.entities != null)
           {
           context.converseContext.nlpResponse.entities.forEach(function (entity) {
            // if(entity.entityName == "sys-person")
               getNameEntity = entity.entityValue;
               console.log("uu"+getNameEntity);
 
             });
           
             if(getNameEntity !=null){
 
             await file.intocalling(getNameEntity,getIntent).then(function(items) {
              dbResponse = items;
              logger.debug("SS"+dbResponse[1]);
            
            }, function(err) {
              console.error('The promise was rejected', err, err.stack);
            });
        
            //put all your stuffs here
            //change for count
            if(dbResponse[1]>0){
 
            
            let verbType = null;
            /*if(dbResponse[1]>1){
             verbType = "the details are";
            }else{
              verbType = "the detail is";
            }
 */
           // botResponse.rsponse[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
           
          // botResponse.response[0] = "Happy to help "
           botResponse.response[0] = "The supervisor of " + getNameEntity + " is " + dbResponse[0];
           //botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
          // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
           }else{
             botResponse.response[0] = "Sorry, we did not find any details";
            // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
           }
         }
       }else{
            botResponse.response[0] = "please enter a valid enterprise id";
        }
       }
       //intent SupervisorDetails -end
        
        
        
            // Intent - Skills - Start
          if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="skills")
          {
            let dbResponse = null;
            let getIntent = null;
            let getNameEntity = null;
            getIntent = nlpResponse.topIntent.intent;
            console.log("qqq"+getIntent);
            console.log("sssss"+context.converseContext.nlpResponse.entities);
            if(context.converseContext.nlpResponse.entities != null)
            {
            context.converseContext.nlpResponse.entities.forEach(function (entity) {
             // if(entity.entityName == "sys-person")
             // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")

                getNameEntity = entity.entityValue;
            console.log("uu"+getNameEntity);

              });
              if(getNameEntity !=null){

              await file.intocalling(getNameEntity,getIntent).then(function(items) {
               dbResponse = items;
               logger.debug("SS"+dbResponse[1]);
             }, function(err) {
               console.error('The promise was rejected', err, err.stack);
             });
             //put all your stuffs here
             //change for count
             if(dbResponse[1]>0){

             
             let verbType = null;
             if(dbResponse[1]>1){
              verbType = "are";
             }else{
              verbType = "is";
             }

            //botResponse.response[0] = " The skills " +verbType + " " + dbResponse[0];
           // botResponse.response[0] = " The skills are" + " " + dbResponse[0]; 
             botResponse.response[0] = " The details of " + getNameEntity + " are " + dbResponse[0];
          //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
       //   botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }else{
           //   botResponse.response[0] = "Sorry, we did not find any details";
              botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }
          }
        }else{
             botResponse.response[0] = "please enter a valid enterprise id";
         }
        }
          // Intent - Skills - End
          
          
          
               // Intent - timesheet reviewer - Start
        else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="timeSheetReviewer")
          {
            let dbResponse = null;
            let getIntent = null;
            let getNameEntity = null;
            let requiredEntityType = null;
            getIntent = nlpResponse.topIntent.intent;
            console.log("qqq"+getIntent);
            console.log("sssss"+context.converseContext.nlpResponse.entities);
            if(context.converseContext.nlpResponse.entities != null)
            {
            context.converseContext.nlpResponse.entities.forEach(function (entity) {
             // if(entity.entityName == "sys-person")
             // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
             entityType = entity.entityName;   
             if(entityType =="enterpriseId")
             {
                getNameEntity = entity.entityValue;
                requiredEntityType = entityType;
             }
              });
              console.log("==>"+getNameEntity+"===?"+requiredEntityType);
              if(getNameEntity !=null && requiredEntityType =="enterpriseId"){
console.log("yes");
              await file.intocalling(getNameEntity,getIntent).then(function(items) {
               dbResponse = items;
               logger.debug("SS"+dbResponse[1]);
             }, function(err) {
               console.error('The promise was rejected', err, err.stack);
             });
             //put all your stuffs here
             //change for count
             if(dbResponse[1]>0){

             
             let verbType = null;
             if(dbResponse[1]>1){
              verbType = "the details are";
             }else{
               verbType = "the detail is";
             }

            botResponse.response[0] = "Time sheet reviewer of " + getNameEntity + " is " + dbResponse[0];
           // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
           // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }else{
              botResponse.response[0] = "Sorry, we did not find any details";
            //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }
          }
        }else{
             botResponse.response[0] = "please enter a valid enterprise id";
         }
        }
        // Intent timesheet reviewer - end
        
        
           // Intent - current Initiative - Start
          else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="currentInitiative")
          {
            let dbResponse = null;
            let getIntent = null;
            let getNameEntity = null;
            getIntent = nlpResponse.topIntent.intent;
            console.log("qqq"+getIntent);
            console.log("sssss"+context.converseContext.nlpResponse.entities);
            if(context.converseContext.nlpResponse.entities != null)
            {
            context.converseContext.nlpResponse.entities.forEach(function (entity) {
             // if(entity.entityName == "sys-person")
             // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")

                getNameEntity = entity.entityValue;
            console.log("uu"+getNameEntity);

              });
              if(getNameEntity !=null){

              await file.intocalling(getNameEntity,getIntent).then(function(items) {
               dbResponse = items;
               logger.debug("SS"+dbResponse[1]);
             }, function(err) {
               console.error('The promise was rejected', err, err.stack);
             });
             //put all your stuffs here
             //change for count
             if(dbResponse[1]>0){

             
             let responseCount = null;
             if(dbResponse[1]>1){
              responseCount = " are ";
             }else{
              responseCount = " is ";
             }

            botResponse.response[0] = "Number of Initiative/s found for " + getNameEntity + responseCount + dbResponse[1] + " and those " + responseCount + "\n" + dbResponse[0];
           //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
           //botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }else{
              botResponse.response[0] = "Sorry, We did not find any details.";
           //   botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }
          }
        }else{
             botResponse.response[0] = "please enter a valid enterprise id";
         }
        }
          // Intent - current Initiative - End
          
          
              // Intent - Performance Reviewer - Start
           else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="performanceReviewer")
          {
            let dbResponse = null;
            let getIntent = null;
            let getNameEntity = null;
            getIntent = nlpResponse.topIntent.intent;
            console.log("qqq"+getIntent);
            console.log("sssss"+context.converseContext.nlpResponse.entities);
            if(context.converseContext.nlpResponse.entities != null)
            {
            context.converseContext.nlpResponse.entities.forEach(function (entity) {
             // if(entity.entityName == "sys-person")
             // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")

                getNameEntity = entity.entityValue;
            console.log("uu"+getNameEntity);

              });
              if(getNameEntity !=null){

              await file.intocalling(getNameEntity,getIntent).then(function(items) {
               dbResponse = items;
               logger.debug("SS"+dbResponse[1]);
             }, function(err) {
               console.error('The promise was rejected', err, err.stack);
             });
             //put all your stuffs here
             //change for count
             if(dbResponse[1]>0){

             
             let responseCount = null;
             if(dbResponse[1]>1){
              responseCount = " are";
             }else{
              responseCount = " is";
             }

            botResponse.response[0] = "Name of Performance Reviewer of " + getNameEntity + responseCount + "\n" + dbResponse[0];
           // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
         //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }else{
              botResponse.response[0] = "Sorry, We did not find any details.";
           //   botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }
          }
        }else{
             botResponse.response[0] = "please enter a valid enterprise id";
         }
        }
            // Intent - Performance Reviewer - End
             // Intent - Previous Initiative - Start
           else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="previousInitiative")
           {
             let dbResponse = null;
             let getIntent = null;
             let getNameEntity = null;
             getIntent = nlpResponse.topIntent.intent;
             console.log("qqq"+getIntent);
             console.log("sssss"+context.converseContext.nlpResponse.entities);
             if(context.converseContext.nlpResponse.entities != null)
             {
             context.converseContext.nlpResponse.entities.forEach(function (entity) {
              // if(entity.entityName == "sys-person")
              // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
 
                 getNameEntity = entity.entityValue;
             console.log("uu"+getNameEntity);
 
               });
               if(getNameEntity !=null){
 
               await file.intocalling(getNameEntity,getIntent).then(function(items) {
                dbResponse = items;
                logger.debug("SS"+dbResponse[1]);
              }, function(err) {
                console.error('The promise was rejected', err, err.stack);
              });
              //put all your stuffs here
              //change for count
              if(dbResponse[1]>0){
 
              
              let responseCount = null;
              if(dbResponse[1]>1){
               responseCount = "the details are";
              }else{
               responseCount = "the detail is";
              }
              //console.log("==>"+botResponse.response[0]);
             // console.log("==>"+botResponse);
              botResponse.response[0] = "Number of Initiative/s found for " + getNameEntity + ":" + dbResponse[1] + " and " +responseCount + "\n" + dbResponse[0];
             // console.log("==>"+botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query");
            // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
           // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
             }else{
               botResponse.response[0] = "Sorry, We did not find any details.";
             //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
             }
           }
         }else{
              botResponse.response[0] = "please enter a valid enterprise id";
          }
         }
             // Intent - Previous Initiative - End
                // Intent - Project sort - Start
           else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="projectSort")
           {
             let dbResponse = null;
             let getIntent = null;
             let getNameEntity = null;
             getIntent = nlpResponse.topIntent.intent;
             console.log("qqq"+getIntent);
             console.log("sssss"+context.converseContext.nlpResponse.entities);
             if(context.converseContext.nlpResponse.entities != null)
             {
             context.converseContext.nlpResponse.entities.forEach(function (entity) {
              // if(entity.entityName == "sys-person")
              // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
 
                 getNameEntity = entity.entityValue;
             console.log("uu"+getNameEntity);
 
               });
               if(getNameEntity !=null){
 
               await file.intocalling(getNameEntity,getIntent).then(function(items) {
                dbResponse = items;
                logger.debug("SS"+dbResponse[1]);
              }, function(err) {
                console.error('The promise was rejected', err, err.stack);
              });
              //put all your stuffs here
              //change for count
              if(dbResponse[1]>0){
 
              
              let responseCount = null;
              if(dbResponse[1]>1){
               responseCount = "the details are";
              }else{
               responseCount = "the detail is";
              }
 
              botResponse.response[0] = "Number of employee/s working in " + getNameEntity + " are : "+ dbResponse[1] + " and " +responseCount + "\n" + dbResponse[0];
             // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
           //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
 
             }else{
               botResponse.response[0] = "Sorry, We did not find any details.";
              // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
             }
           }
         }else{
              botResponse.response[0] = "please enter a valid enterprise id";
          }
         }
             // Intent - Project Sort - End
             
             // empLoc start
             else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="empLoc")
             {
               let dbResponse = null;
               let getIntent = null;
               let getNameEntity = null;
               getIntent = nlpResponse.topIntent.intent;
               console.log("qqq"+getIntent);
               console.log("sssss"+context.converseContext.nlpResponse.entities);
               if(context.converseContext.nlpResponse.entities != null)
               {
               context.converseContext.nlpResponse.entities.forEach(function (entity) {
                // if(entity.entityName == "sys-person")
                // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
   
                   getNameEntity = entity.entityValue;
               console.log("uu"+getNameEntity);
   
                 });
                 if(getNameEntity !=null){
   
                 await file.intocalling(getNameEntity,getIntent).then(function(items) {
                  dbResponse = items;
                  logger.debug("SS"+dbResponse[1]);
                }, function(err) {
                  console.error('The promise was rejected', err, err.stack);
                });
                //put all your stuffs here
                //change for count
                if(dbResponse[1]>0){
   
                
                let responseCount = null;
                if(dbResponse[1]>1){
                 responseCount = "the details are";
                }else{
                 responseCount = "the detail is";
                }
   
                botResponse.response[0] = "Number of employee/s working in " + getNameEntity + ":" + dbResponse[1] + " and " +responseCount + "\n" + "<table style='width:100%' border='1'><tr> <th style='width:10%'>S.NO</th> <th style='padding-left:5px;width:30%'>Name</th> <th style='padding-left:5px;width:15%'>Designation</th> <th style='padding-left:5px;width:20%'>Primary Skill</th> <th style='padding-left:5px;width:25%'>RollOff Date</th></tr>" + dbResponse[0] + "</table>";
               // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
             //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
   
               }else{
                 botResponse.response[0] = "Sorry, We did not find any details.";
                // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
               }
             }
           }else{
                botResponse.response[0] = "please enter a valid questions";
            }
           }
             //empLoc end


             //Intent skillLoc start
             else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="SkillLoc")
             {
               let dbResponse = null;
               let getIntent = null;
               let getNameEntity = null;
               getIntent = nlpResponse.topIntent.intent;
               console.log("qqq"+getIntent);
               console.log("sssss"+context.converseContext.nlpResponse.entities);
               if(context.converseContext.nlpResponse.entities != null)
               {
               context.converseContext.nlpResponse.entities.forEach(function (entity) {
                // if(entity.entityName == "sys-person")
                // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
   
                   getNameEntity = entity.entityValue;
               console.log("uu"+getNameEntity);
   
                 });
                 if(getNameEntity !=null){
   
                 await file.intocalling(getNameEntity,getIntent).then(function(items) {
                  dbResponse = items;
                  logger.debug("SS"+dbResponse[1]);
                }, function(err) {
                  console.error('The promise was rejected', err, err.stack);
                });
                //put all your stuffs here
                //change for count
                if(dbResponse[1]>0){
   
                
                let responseCount = null;
                if(dbResponse[1]>1){
                 responseCount = " are ";
                }else{
                 responseCount = " is ";
                }
   
                botResponse.response[0] = getNameEntity + " has following skills. and " +responseCount + "\n" + dbResponse[0];
               // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
             //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
   
               }else{
                 botResponse.response[0] = "Sorry, We did not find any details.";
                // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
               }
             }
           }else{
                botResponse.response[0] = "please enter a valid skills query";
            }
           }
             //Intent skillLoc end
        //      else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="rollOnPeople")
       //    {
       //     botResponse.response[0] = "Yet to implement";
       //     botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";

       //  }
             // Intent - RollOnPeople - End
           //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
        //skillset intent start
        else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="SkillSet")
        {
          console.log("hhhheeeeeeyyyyyyyyyyyy")
          let dbResponse = null;
          let getIntent = null;
          let getNameEntity = null;
          getIntent = nlpResponse.topIntent.intent;
          console.log("qqq"+getIntent);
          console.log("sssss"+context.converseContext.nlpResponse.entities);
          if(context.converseContext.nlpResponse.entities != null)
          {
          context.converseContext.nlpResponse.entities.forEach(function (entity) {
           // if(entity.entityName == "sys-person")
           // if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")

              getNameEntity = entity.entityValue;
          console.log("uu"+getNameEntity);

            });
            if(getNameEntity !=null){

            await file.intocalling(getNameEntity,getIntent).then(function(items) {
             dbResponse = items;
             logger.debug("SS"+dbResponse[1]);
           }, function(err) {
             console.error('The promise was rejected', err, err.stack);
           });
           //put all your stuffs here
           //change for count
           if(dbResponse[1]>0){

           
           let responseCount = null;
           if(dbResponse[1]>1){
            responseCount = "the details are";
           }else{
            responseCount = "the detail is";
           }

           botResponse.response[0] = "Number of employee/s having " + getNameEntity + " skill : " + dbResponse[1] + " and " + responseCount + "\n" + "<table style='width:100%' border='1'><tr> <th style='width:10%'>S.NO</th> <th style='padding-left:5px;width:30%'>Name</th> <th style='padding-left:5px;width:15%'>Designation</th> <th style='padding-left:5px;width:20%'>WorkPlace</th> <th style='padding-left:5px;width:25%'>RollOff_Date</th></tr>" + dbResponse[0] + "</table>";
          // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
         // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details.. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";

          }else{
            botResponse.response[0] = "Sorry, We did not find any details.";
           // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
          }
        }
      }else{
           botResponse.response[0] = "please enter a valid enterprise id";
       }
      }


        //end skillset intent
        
          //start intent workDetails
       else if(botResponse && nlpResponse && nlpResponse.topIntent.intent==="workDetails") {
           logger.debug("ggggg");

           let dbResponse = null;
           let getIntent = null;
           let getNameEntity = null;
           getIntent = nlpResponse.topIntent.intent;
           console.log("qqq"+getIntent);
           console.log("sssss"+context.converseContext.nlpResponse.entities);
           if(context.converseContext.nlpResponse.entities != null)
           {
           context.converseContext.nlpResponse.entities.forEach(function (entity) {
            // if(entity.entityName == "sys-person")
               getNameEntity = entity.entityValue;
               console.log("uu"+getNameEntity);

             });
           
             if(getNameEntity !=null){

             await file.intocalling(getNameEntity,getIntent).then(function(items) {
              dbResponse = items;
              logger.debug("SS"+dbResponse[1]);
            
              
            }, function(err) {
              console.error('The promise was rejected', err, err.stack);
            });
         
            //put all your stuffs here
            //change for count
            if(dbResponse[1]>0){

            
            let responseCount = null;
            if(dbResponse[1]>1){
              responseCount = " are ";
            }else{
              responseCount = " is ";
            }

           // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
           botResponse.response[0] = "The workplace of " + getNameEntity + responseCount + "\n" + dbResponse[0];
           //botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
         //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
           }else{
             botResponse.response[0] = "Sorry, We did not find any details.";
           //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
           }
         }
       }else{
            botResponse.response[0] = "please enter a valid enterprise id";
        }
         
        }
          //end intent workDetails
         //start intent designationEmp
         else if(botResponse && nlpResponse && nlpResponse.topIntent.intent==="designationEmp"){
          logger.debug("ppp");

          let dbResponse = null;
          let getIntent = null;
          let getNameEntity = null;
          getIntent = nlpResponse.topIntent.intent;
          console.log("qqq"+getIntent);
          console.log("sssss"+context.converseContext.nlpResponse.entities);
          if(context.converseContext.nlpResponse.entities != null)
          {
          context.converseContext.nlpResponse.entities.forEach(function (entity) {
           // if(entity.entityName == "sys-person")
              getNameEntity = entity.entityValue;
              console.log("uu"+getNameEntity);

            });
          
            if(getNameEntity !=null){

            await file.intocalling(getNameEntity,getIntent).then(function(items) {
             dbResponse = items;
             logger.debug("SS"+dbResponse[1]);
          
             
           }, function(err) {
             console.error('The promise was rejected', err, err.stack);
           });
        
           //put all your stuffs here
           //change for count
           if(dbResponse[1]>0){

           
           let responseCount = null;
           if(dbResponse[1]>1){
            responseCount = " are ";
           }else{
            responseCount = " is ";
           }

          // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
          botResponse.response[0] = "The designation of " + getNameEntity + responseCount + " " + "\n" + dbResponse[0];
          //botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
         // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
          }else{
            botResponse.response[0] = "Sorry, We did not find any details.";
         //   botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
          }
        }
      }else{
           botResponse.response[0] = "please enter a valid enterprise id";
       }
        
       }
         //end intent designationEmp


         //start intent employeeID

          else if(botResponse && nlpResponse && nlpResponse.topIntent.intent==="employeeID"){
           logger.debug("ggggg");

           let dbResponse = null;
           let getIntent = null;
           let getNameEntity = null;
           getIntent = nlpResponse.topIntent.intent;
           console.log("qqq"+getIntent);
           console.log("sssss"+context.converseContext.nlpResponse.entities);
           if(context.converseContext.nlpResponse.entities != null)
           {
           context.converseContext.nlpResponse.entities.forEach(function (entity) {
            // if(entity.entityName == "sys-person")
               getNameEntity = entity.entityValue;
               console.log("uu"+getNameEntity);

             });
           
             if(getNameEntity !=null){

             await file.intocalling(getNameEntity,getIntent).then(function(items) {
              dbResponse = items;
              logger.debug("SS"+dbResponse[1]);
             // logger.debug("qq"+dbResponse.count);
           // let count=0;
           // dbResponse.forEach(function(){
             // count=count+1;
              //logger.debug("FF"+count);

            //})
              
            }, function(err) {
              console.error('The promise was rejected', err, err.stack);
            });
           //}
           // else{
             // logger.debug("hhh");
             // botResponse.response[0] = botResponse.response[0] + "No certification done by" + getNameEntity;
          //  }
          //  console.log("aparna"+dbResponse);
            //put all your stuffs here
            //change for count
            if(dbResponse[1]>0){

            
            let data = null;
            if(dbResponse[1]>1){
             data = "the details are";
            }else{
              data = "the detail is";
            }

           // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
           botResponse.response[0] = "The employee id is " + dbResponse[0];
   
           }else{
             botResponse.response[0] = "Sorry, We did not find any details.";
             botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
           }
         }
       }else{
            botResponse.response[0] = "please enter a valid enterprise id";
        }
         
        }
          //end intent employeeID
        
          //start intent DOJ

         else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="DOJ")
          {
            let dbResponse = null;
            let getIntent = null;
            let getNameEntity = null;
            getIntent = nlpResponse.topIntent.intent;
            console.log("qqq"+getIntent);
            console.log("sssss"+context.converseContext.nlpResponse.entities);
            if(context.converseContext.nlpResponse.entities != null)
            {
            context.converseContext.nlpResponse.entities.forEach(function (entity) {
             // if(entity.entityName == "sys-person")
                getNameEntity = entity.entityValue;
                console.log("uu"+getNameEntity);

              });
            
              if(getNameEntity !=null){

              await file.intocalling(getNameEntity,getIntent).then(function(items) {
               dbResponse = items;
               logger.debug("SS"+dbResponse[1]);
            
               
             }, function(err) {
               console.error('The promise was rejected', err, err.stack);
             });
           
             //put all your stuffs here
             //change for count
             if(dbResponse[1]>0){

             
             let responseCount = null;
             if(dbResponse[1]>1){
              responseCount = " are:";
             }else{
              responseCount = " is:";
             }

            // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
            botResponse.response[0] = "The Date of joining of " + getNameEntity + responseCount + "\n" + dbResponse[0];
            //botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
            //botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
    
            }else{
              botResponse.response[0] = "Sorry, We did not find any details.";
             // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }
          }
        }else{
             botResponse.response[0] = "please enter a valid enterprise id";
         }
        }

          //end intent DOJ


          //start intent contact


          else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="contact")
          {
            console.log("ppp"+nlpResponse.topIntent.intent);
            let dbResponse = null;
            let getIntent = null;
            let getNameEntity = null;
            getIntent = nlpResponse.topIntent.intent;
            console.log("qqq"+getIntent);
            console.log("sssss"+context.converseContext.nlpResponse.entities);
            if(context.converseContext.nlpResponse.entities != null)
            {
            context.converseContext.nlpResponse.entities.forEach(function (entity) {
             // if(entity.entityName == "sys-person")
                getNameEntity = entity.entityValue;
                console.log("uu"+getNameEntity);

              });
            
              if(getNameEntity !=null){

              await file.intocalling(getNameEntity,getIntent).then(function(items) {
               dbResponse = items;
               logger.debug("SS"+dbResponse[1]);
             
               
             }, function(err) {
               console.error('The promise was rejected', err, err.stack);
             });
           
             //put all your stuffs here
             //change for count
             if(dbResponse[1]>0){

             
             let responseCount = null;
             if(dbResponse[1]>1){
              responseCount = " are:";
             }else{
              responseCount = " is:";
             }

            // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
            botResponse.response[0] = "The contact number of " + getNameEntity +  responseCount + "\n" + dbResponse[0];
           // botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
         //  botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
    
            }else{
              botResponse.response[0] = "Sorry, We did not find any details.";
           //   botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Team details. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
            }
          }
        }else{
             botResponse.response[0] = "please enter a valid enterprise id";
         }
        }


          //end intent contact


          //start intent vacationRequest
          
 else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="vacationRequest")
{
let dbResponse = null;
let getIntent = null;
//let getNameEntity = null;
let getNameEntity = [];
let requiredEntityType = null;
var getStartDateEntity = [];
let getEndDateEntity = null;
getIntent = nlpResponse.topIntent.intent;
console.log("qqq"+getIntent);
console.log("sssss"+context.converseContext.nlpResponse.entities);
if(context.converseContext.nlpResponse.entities != null)
{
context.converseContext.nlpResponse.entities.forEach(function (entity) {
// if(entity.entityName == "sys-person")
// if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
 
//entityType = entity.entityName;
//if(entityType =="enterpriseId")
if(entity.entityName == "sys-date" || entity.entityName == "enterpriseId")
            {
               // getNameEntity = entity.entityValue;
                //requiredEntityType = entityType;
                entityType = entity.entityName;
                if(entityType =="enterpriseId")
                {
                  requiredEntityType = entityType;
                }
           
                getNameEntity.push(entity.entityValue);
                console.log("iiii"+entity.entityValue);
             }
// getNameEntity = entity.entityValue;
// console.log("uu"+getNameEntity);
 
});
//if(getNameEntity != null)
// {
  console.dir(getNameEntity);
  console.log("==>"+getNameEntity+"===?"+requiredEntityType);
  if(getNameEntity !=null && requiredEntityType =="enterpriseId"){
console.log("yes");
 
//if(getNameEntity !=null){
 
await file.intocalling(getNameEntity,getIntent).then(function(items) {
dbResponse = items;
logger.debug("SS"+dbResponse[1]);
// logger.debug("qq"+dbResponse.count);
// let count=0;
// dbResponse.forEach(function(){
// count=count+1;
//logger.debug("FF"+count);
 
//})
}, function(err) {
console.error('The promise was rejected', err, err.stack);
});
//}
// else{
// logger.debug("hhh");
// botResponse.response[0] = botResponse.response[0] + "No certification done by" + getNameEntity;
// }
// console.log("aparna"+dbResponse);
//put all your stuffs here
//change for count
if(dbResponse[1]>0){
 
let responseCount = null;
if(dbResponse[1]>1){
  responseCount = " are ";
}else{
  responseCount = " is ";
}
 
// botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
botResponse.response[0] = "Number of requests sent for vacation by : "+ getNameEntity[0] + responseCount + ":" + dbResponse[1];
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Vacation or WFH. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
// }
// else{
// // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" is : " + dbResponse;
// botResponse.response[0] = botResponse.response[0] + "is " + dbResponse[1] + " and that is: " + dbResponse[0];
// }
}else{
botResponse.response[0] = "Sorry, We didn't find any details";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Vacation or WFH \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
}
}
}else{
botResponse.response[0] = "please enter a valid enterprise id";
}
}
 
//end request vacationRequest 

//start intent wfhRequest
else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="wfhRequest")
{
let dbResponse = null;
let getIntent = null;
//let getNameEntity = null;
let getNameEntity = [];
let requiredEntityType = null;
var getStartDateEntity = [];    
let getEndDateEntity = null;
getIntent = nlpResponse.topIntent.intent;
//console.log("qqq"+getIntent);
//console.log("sssss"+context.converseContext.nlpResponse.entities);
if(context.converseContext.nlpResponse.entities != null)

{
  //getNameEntity = context.converseContext.nlpResponse.entities;
  console.log("kkkk"+typeof getNameEntity);
context.converseContext.nlpResponse.entities.forEach(function (entity) {
// if(entity.entityName == "sys-person")
 if(entity.entityName == "sys-date" || entity.entityName == "enterpriseId")
 {
entityType = entity.entityName;
if(entityType =="enterpriseId")
             {
                //getNameEntity = entity.entityValue;
                requiredEntityType = entityType;
             }
getNameEntity.push(entity.entityValue);
console.log("iiii"+entity.entityValue);
// console.log("uu"+getNameEntity);

            }
});
console.dir(getNameEntity);
//console.log(getNameEntity[0].entityValue+"<<"+getNameEntity[1].entityValue+"<<"+getNameEntity[2].entityValue);
//if(getNameEntity != null)
// {

  console.log("==>"+getNameEntity+"===?"+requiredEntityType);
  if(getNameEntity !=null && requiredEntityType =="enterpriseId"){
console.log("yes");
 
//if(getNameEntity !=null){
 
await file.intocalling(getNameEntity,getIntent).then(function(items) {
dbResponse = items;
logger.debug("SS"+dbResponse[1]);
// logger.debug("qq"+dbResponse.count);
// let count=0;
// dbResponse.forEach(function(){
// count=count+1;
//logger.debug("FF"+count);
 
//})
}, function(err) {
console.error('The promise was rejected', err, err.stack);
});
//}
// else{
// logger.debug("hhh");
// botResponse.response[0] = botResponse.response[0] + "No certification done by" + getNameEntity;
// }
// console.log("aparna"+dbResponse);
//put all your stuffs here
//change for count
if(dbResponse[1]>0){
 
let responseCount = null;
if(dbResponse[1]>1){
responseCount = " are ";
}else{
responseCount = " is ";
}
 
// botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
botResponse.response[0] = "Number of requests sent for WFH by "+ getNameEntity[0] + responseCount + ":" + dbResponse[1];
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Vacation or WFH. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
// }
// else{
// // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" is : " + dbResponse;
// botResponse.response[0] = botResponse.response[0] + "is " + dbResponse[1] + " and that is: " + dbResponse[0];
// }
}else{
botResponse.response[0] = "Sorry, We didn't find any details";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Vacation or WFH \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
}
}
}else{
botResponse.response[0] = "please enter a valid enterprise id";
}
}

//end intent wfhRequest

//vacation pto start
else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="VacationPTO")
{
let dbResponse = null;
let getIntent = null;
//let getNameEntity = null;
let getNameEntity = [];
let requiredEntityType = null;
var getStartDateEntity = [];    
let getEndDateEntity = null;
getIntent = nlpResponse.topIntent.intent;
console.log("qqq"+getIntent);
console.log("sssss"+context.converseContext.nlpResponse.entities);
if(context.converseContext.nlpResponse.entities != null)
{
  console.log("kkkk"+typeof getNameEntity);
context.converseContext.nlpResponse.entities.forEach(function (entity) {
// if(entity.entityName == "sys-person")
// if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
if(entity.entityName == "sys-date" || entity.entityName == "enterpriseId")
{

  entityType = entity.entityName;
if(entityType =="enterpriseId")
             {
                //getNameEntity = entity.entityValue;
                requiredEntityType = entityType;
             }
getNameEntity.push(entity.entityValue);
console.log("iiii"+entity.entityValue);
// console.log("uu"+getNameEntity);

            }
//getNameEntity = entity.entityValue;
//console.log("uu"+getNameEntity);
 
});
//if(getNameEntity != null)
// {
 console.dir(getNameEntity);
//if(getNameEntity !=null){
  
  console.log("==>"+getNameEntity+"===?"+requiredEntityType);
  if(getNameEntity !=null && requiredEntityType =="enterpriseId"){
console.log("yes");
 
await file.intocalling(getNameEntity,getIntent).then(function(items) {
dbResponse = items;
logger.debug("SS"+dbResponse[1]);
// logger.debug("qq"+dbResponse.count);
// let count=0;
// dbResponse.forEach(function(){
// count=count+1;
//logger.debug("FF"+count);
 
//})
}, function(err) {
console.error('The promise was rejected', err, err.stack);
});
//}
// else{
// logger.debug("hhh");
// botResponse.response[0] = botResponse.response[0] + "No certification done by" + getNameEntity;
// }
// console.log("aparna"+dbResponse);
//put all your stuffs here
//change for count
if(dbResponse[1]>0){
 
let abc = null;
if(dbResponse[1]>1){
abc = "the details are";
}else{
abc = "the detail is";
}
 
// botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
botResponse.response[0] = "Following is the count of days for " + getNameEntity + ":" + dbResponse[0];
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Vacation or WFH. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
// }
// else{
// // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" is : " + dbResponse;
// botResponse.response[0] = botResponse.response[0] + "is " + dbResponse[1] + " and that is: " + dbResponse[0];
// }
}else{
botResponse.response[0] = "Sorry, We didn't find any details";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Vacation or WFH \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
}
}
}else{
botResponse.response[0] = "please enter a valid enterprise id";
}
}
//vacation pto end 


//wfhdaycount start
else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="wfhDayCounts")
{
let dbResponse = null;
let getIntent = null;
let getNameEntity = null;
getIntent = nlpResponse.topIntent.intent;
console.log("qqq"+getIntent);
console.log("sssss"+context.converseContext.nlpResponse.entities);
if(context.converseContext.nlpResponse.entities != null)
{
context.converseContext.nlpResponse.entities.forEach(function (entity) {
// if(entity.entityName == "sys-person")
// if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
 
getNameEntity = entity.entityValue;
console.log("uu"+getNameEntity);
 
});
//if(getNameEntity != null)
// {
 
if(getNameEntity !=null){
 
await file.intocalling(getNameEntity,getIntent).then(function(items) {
dbResponse = items;
logger.debug("SS"+dbResponse[1]);
// logger.debug("qq"+dbResponse.count);
// let count=0;
// dbResponse.forEach(function(){
// count=count+1;
//logger.debug("FF"+count);
 
//})
}, function(err) {
console.error('The promise was rejected', err, err.stack);
});
//}
// else{
// logger.debug("hhh");
// botResponse.response[0] = botResponse.response[0] + "No certification done by" + getNameEntity;
// }
// console.log("aparna"+dbResponse);
//put all your stuffs here
//change for count
if(dbResponse[1]>0){
 
let abc = null;
if(dbResponse[1]>1){
abc = "the details are";
}else{
abc = "the detail is";
}
 
// botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
botResponse.response[0] = "Following is the count of days for " + getNameEntity + ":"+ dbResponse[0];
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Vacation or WFH. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
// }
// else{
// // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" is : " + dbResponse;
// botResponse.response[0] = botResponse.response[0] + "is " + dbResponse[1] + " and that is: " + dbResponse[0];
// }
}else{
botResponse.response[0] = "Sorry, We didn't find any details";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to Vacation or WFH \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
}
}
}else{
botResponse.response[0] = "please enter a valid enterprise id";
}
}

//end intent wfhDayCounts
//start intent rollOnPeople
else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="rollOnPeople")
{
let dbResponse = null;
let getIntent = null;
let getNameEntity = null;
getIntent = nlpResponse.topIntent.intent;
console.log("qqq"+getIntent);
console.log("sssss"+context.converseContext.nlpResponse.entities);
if(context.converseContext.nlpResponse.entities != null)
{
context.converseContext.nlpResponse.entities.forEach(function (entity) {
// if(entity.entityName == "sys-person")
// if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
 
getNameEntity = entity.entityValue;
console.log("uu"+getNameEntity);
 
});
//if(getNameEntity != null)
// {
 
if(getNameEntity !=null){
 
await file.intocalling(getNameEntity,getIntent).then(function(items) {
dbResponse = items;
logger.debug("SS"+dbResponse[1]);
// logger.debug("qq"+dbResponse.count);
// let count=0;
// dbResponse.forEach(function(){
// count=count+1;
//logger.debug("FF"+count);
 
//})
}, function(err) {
console.error('The promise was rejected', err, err.stack);
});
//}
// else{
// logger.debug("hhh");
// botResponse.response[0] = botResponse.response[0] + "No certification done by" + getNameEntity;
// }
// console.log("aparna"+dbResponse);
//put all your stuffs here
//change for count
if(dbResponse[1]>0){
 
  let abc = null;
  if(dbResponse[1]>1){
  abc = " are ";
  }else{
  abc = " is ";
  }
 
// botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
botResponse.response[0] = "Roll on Date of " + getNameEntity + abc + dbResponse[0];
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to RollOn/Off. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
// }
// else{
// // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" is : " + dbResponse;
// botResponse.response[0] = botResponse.response[0] + "is " + dbResponse[1] + " and that is: " + dbResponse[0];
// }
}else{
botResponse.response[0] = "Sorry, We did not find any details.";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to RollOn/Off \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
}
}
}else{
botResponse.response[0] = "please enter a valid enterprise id";
}
} 

//end intent rollOnPeople

//start intent rollOffPeople

else if (botResponse && nlpResponse && nlpResponse.topIntent.intent==="rollOffPeople")
{
let dbResponse = null;
let getIntent = null;
let getNameEntity = null;
getIntent = nlpResponse.topIntent.intent;
console.log("qqq"+getIntent);
console.log("sssss"+context.converseContext.nlpResponse.entities);
if(context.converseContext.nlpResponse.entities != null)
{
context.converseContext.nlpResponse.entities.forEach(function (entity) {
// if(entity.entityName == "sys-person")
// if(entity.entityName == "sys-person" || entity.entityName == "enterpriseId")
 
getNameEntity = entity.entityValue;
console.log("uu"+getNameEntity);
 
});
//if(getNameEntity != null)
// {
 
if(getNameEntity !=null){
 
await file.intocalling(getNameEntity,getIntent).then(function(items) {
dbResponse = items;
logger.debug("SS"+dbResponse[1]);
// logger.debug("qq"+dbResponse.count);
// let count=0;
// dbResponse.forEach(function(){
// count=count+1;
//logger.debug("FF"+count);
 
//})
}, function(err) {
console.error('The promise was rejected', err, err.stack);
});
//}
// else{
// logger.debug("hhh");
// botResponse.response[0] = botResponse.response[0] + "No certification done by" + getNameEntity;
// }
// console.log("aparna"+dbResponse);
//put all your stuffs here
//change for count
if(dbResponse[1]>0){
 
  let abc = null;
  if(dbResponse[1]>1){
  abc = " are ";
  }else{
  abc = " is ";
  }
 
// botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" are : " + dbResponse;
botResponse.response[0] = "Roll off Date of " + getNameEntity + abc + dbResponse[0];
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n Please ask if you have any other query";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to RollOn/off. \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
// }
// else{
// // botResponse.response[0] = botResponse.response[0] + " "+getNameEntity+" is : " + dbResponse;
// botResponse.response[0] = botResponse.response[0] + "is " + dbResponse[1] + " and that is: " + dbResponse[0];
// }
}else{
botResponse.response[0] = "Sorry, We did not find any details.";
//botResponse.response[0] = botResponse.response[0]+"\n Thank you. \n\n Please ask if you have any other query related to RollOn/off \n\n Please type “start” to start the conversation again with other category. \n or “end” to end the conversation";
}
}
}else{
botResponse.response[0] = "please enter a valid enterprise id";
}
} 



//end  intent rollOffPeople
 

          return await this.setResponse(botResponse, context);
        }
      } else {
        let foundUserInput = flows.find(obj => {
          return obj.currentStep.includes(context.converseContext.currentStep);
        });
        if (foundUserInput) {
          logger.debug("Found user input: " + JSON.stringify(foundUserInput));
          foundUserInput.nextSteps.forEach(step => {
            botResponse = flows.find(obj => {
              return obj.currentStep.includes(step);
            });
          });
        }
        return await this.setResponse(botResponse, context);
      }
    } else {
      logger.debug("No conversation flow");
      return await this.setResponse(null, context);
    }
  },

  /**
   * @description This method takes the response block, sets the context reponse to be the idenitfied
   * and correctly sets the response by evaluating any required parameter in it
   * @param {Object} responseBlock - This is the response node identified from the flow
   * @param {Object} converseContext - The current context object
   */
  setResponse: async function (responseBlock, context) {
    if (responseBlock) {
      let formattedResponse = responseBlock.response;
      context.converseResponse = {};
      // Loop through each response bubble and evaluate API variable, Context variable, stored entities or Dynamic buttons in it
      for (let x = 0; x < formattedResponse.length; x++) {
        // process variable request
        let variableInResponse = utils.getFromBetween.get(
          formattedResponse[x],
          "${",
          "}"
        );
        if (variableInResponse && variableInResponse.length > 0) {
          formattedResponse[x] = await variableHandler.evaluateVariable(
            variableInResponse,
            context,
            formattedResponse[x]
          );
        }
        // If Dynamic Buttons is required them make API call and create the buttons dynamically based on response
        if (
          responseBlock.responseConfig &&
          responseBlock.responseConfig.dynamicButtonsIterableProperty &&
          responseBlock.responseConfig.variables
        ) {
          responseBlock.responseConfig = await this.createDynamicButtons(responseBlock.responseConfig, context);
        }
      }

      // Update context with newly evaluated responses and current flow
      context = this.updateContext(context, formattedResponse, responseBlock);

      // Send response based on current use case
      return this.sendUpdatedResponse(context, responseBlock);
    } else {
      context.converseContext.useCaseId = null;
      context.converseContext.useCaseName = null;
      context.converseContext.workerBotId = null;
      context.converseContext.currentStep = "entrypoint";
      context.converseContext.endFlow =
        responseBlock && responseBlock.endFlow ? responseBlock.endFlow : false;
      return apiCaller.processRequest(context).catch(error => {
        logger.error(
          __filename +
          " - " +
          Date.now() +
          " - Error processing request in setResponse: " +
          error,
          {
            component: "RESPONSEHANDLER"
          }
        );
      });
    }
  },
  /**
   * @description - This retrieves the correct response in the flow based on the current context - specific for consecutive Variable decision calls
   * @param {String} context - The currentStep to be retrieved
   * @param {Object} currentNode - The bot node to execute
   * @param {Object} botResponseFlows - a list of all bot response flows
   * @param {Object} flows - A list of all flows
   * @param {Object} botConditionResponses - a list of all bot condition responses
   * @returns {Object} - The response object with text and/or response config
   */

  processVariableDecision: async function (
    context,
    currentNode,
    botResponseFlows,
    flows,
    botConditionResponses
  ) {
    // Send response to FE before processing further variables if any
    await this.setResponse(currentNode, context);
    // We process the decision call here to obtain a response to make the decision
    // Evaluate the variable(s), get the value and store it in an object, create the keys dynamically (key that matches as they are defined in condition expression eg. {userMessage: account balance} - userMessage==='account balance')
    var response = {};
    for (let i = 0; i < currentNode.responseConfig.variables.length; i++) {
      response[
        currentNode.responseConfig.variables[i]
      ] = await variableHandler.evaluateDecisionVariable(
        currentNode.responseConfig.variables[i],
        context
      );
    }

    // Evaluate decisions of API step
    let nextStepNode = findVariableDecisionNextStep(
      context,
      botConditionResponses,
      botResponseFlows,
      response
    );
    // If the nextStepNode is another decision node then evaluate that too
    if (nextStepNode !== undefined && nextStepNode.responseType === "variable") {
      return this.processVariableDecision(
        context,
        nextStepNode,
        botResponseFlows,
        flows,
        botConditionResponses
      );
    } else if (nextStepNode !== undefined) {
      // Send the response to the user
      return await this.setResponse(nextStepNode, context);
    }
  },

  createDynamicButtons: async function (responseConfig, context) {
    const dynamicButtons = [];
    // Execute the API provided to get the iterable object
    const apiObjectIterable = await variableHandler.evaluateVariable(
      responseConfig.variables,
      context,
      null
    );

    // Create the buttons for our responseConfig object by looping through the iterable object and evaluating on the property
    try {
      for (let i = 0; i < apiObjectIterable.length; i++) {
        const obj = apiObjectIterable[i];
        const buttonVal = eval(
          "obj." + responseConfig.dynamicButtonsIterableProperty
        );
        dynamicButtons.push(buttonVal);
      }
    } catch (err) {
      logger.debug(
        "Cannot create dynamic buttons with the current API configuration provided"
      );
    }
    // return evaluated json with our dynamic buttons
    return {
      buttons: dynamicButtons
    };
  },

  updateContext: function (context, formattedResponse, responseBlock) {
    context.converseResponse.response = formattedResponse;
    context.converseResponse.responseConfig = responseBlock.responseConfig;
    context.converseContext.previousStep = context.converseContext.currentStep;
    context.converseContext.currentStep = responseBlock.nextSteps;
    context.converseContext.requestCount = 0;
    return context;
  },

  sendUpdatedResponse: async function (context, responseBlock) {
    //logEvent endFLOW D2
    if (responseBlock.endFlow) {
      apiCaller.logEvent(context, 'endFlow').catch(function(error){
        logger.error(__filename+' -> ' + 'Error in the CFM Service' + error, {component: "RESPONSEHANDLER"});
      });
    }
    if (
      responseBlock &&
      responseBlock.endFlow &&
      context.converseContext.useCaseName.toString().toLowerCase() !==
      "authentication"
    ) {
      apiCaller.sendResponse(context).catch(error => {
        logger.error(
          __filename +
          " - " +
          Date.now() +
          " - Error sending response in setResponse: " +
          error,
          {
            component: "RESPONSEHANDLER"
          }
        );
      });
      return this.feedbackResponse(context);
    } else if (context.converseContext.useCaseName === "escalation") {
      context.converseContext.liveChat = true;
      return apiCaller.livePerson(context).catch(error => {
        logger.error(
          __filename +
          " - " +
          Date.now() +
          " - Error starting chat with liveperson: " +
          error,
          {
            component: "RESPONSEHANDLER"
          }
        );
      });
    } else if (
      context.converseContext.useCaseName === "feedback" &&
      context.customObject.feedbackReceived === false
    ) {
      logger.debug("Creating response block for feedback check...");
      // Get the feedback values
      responseBlock.response = Object.keys(
        responseBlock.responseConfig.card.smileys
      );
      return responseBlock;
    } else {
      apiCaller.logEvent(context,null).catch(function(error){
        logger.error(__filename+' -> ' + 'Error in the CFM Service' + error, {component: "RESPONSEHANDLER"});
      });
      return apiCaller.sendResponse(context).catch(error => {
        logger.error(
          __filename +
          " - " +
          Date.now() +
          " - Error sending response in setResponse: " +
          error,
          {
            component: "RESPONSEHANDLER"
          }
        );
      });
    }
  },

  /**
   * @description - Method that gets the feedback flow from the MasterBot
   * @param {Object} context - Context object at the current point
   */
  feedbackResponse: async function (context) {
    try {
      apiCaller.logEvent(context,'feedBackRequested').catch(function(error){
        logger.error(__filename+' -> ' + 'Error in the CFM Service' + error, {component: "RESPONSEHANDLER"});
      });
      let masterBot = await dbHandler.getMasterBot(
        context.converseContext.masterBotId
      );
      let previousUsecase = await dbHandler.getUseCaseByName(
        context.converseContext.useCaseName,
        context.converseContext.workerBotId
      );
      let usecase = await dbHandler.getUseCaseByName(
        "feedback",
        masterBot.masterBotDefaultBotId
      );
      if (previousUsecase && previousUsecase.collectFeedback) {
        let conversationFlow = await dbHandler.getConversationFlow(
          usecase.useCaseId,
          context.converseContext.channel
        );
        context.converseContext.useCaseId = usecase.useCaseId;
        context.converseContext.useCaseName = usecase.useCaseName;
        context.converseContext.workerBotId = masterBot.masterBotDefaultBotId;
        context.customObject.awaitingFeedback = true;
        context.converseContext.currentStep = "entrypoint";
        this.getResponse(context, null, conversationFlow);
      }
    } catch (error) {
      logger.error(
        __filename +
        " - " +
        Date.now() +
        " - Error processing request in feedbackResponse: " +
        error,
        {
          component: "RESPONSEHANDLER"
        }
      );
    }
  },
  checkEntitiesExist: checkEntitiesExist
};

/**
 * @description - function to check if entities in the flow match the NLP result entitites
 * @param {Object} nodeEntities -
 * @param {Object} entities -
 * @return {Boolean} matchedEntities - to determine whether the entities array is matched
 */
function checkEntitiesExist(nodeEntities, entities) {
  let matchedEntities = true;
  if (nodeEntities && nodeEntities[0] !== null) {
    matchedEntities = nodeEntities.every(
      //entity => entities.indexOf(entity) > -1
      entity => isMatching(entity, entities)
    );
  }
  return matchedEntities;
}

/**
 * @description Function that finds the next steps from the user block
 * @param {Object} context context from flow
 * @param {Object} userFlows The flow object extracted from the Conversation Flow object
 * @param {Object} nlpResponse The NLP Response from the worker bot provider
 * @returns {Object} NextSteps - The list of next possible steps to respond with
 */

// TODO: Error Handling
function findNextSteps(context, userFlows, nlpResponse) {
  var userResponses = null;
  var entities = nlpResponse.entities;
  /**LSLCUSEN-211: Here the aim is to find the correct conversationflow by matching entites.
   * Entites defined in conversationflow should match with NLP entities. If exact match is found, return the
   * conversationflow of that matching entities else return the conversationflow which has no entities defined.
   * Example: If NLP returns 'Entities = iPhone' and if there are multiple Conversationflows,
   * conversationflow1= {"entities" : []}
   * and conversationflow2 ="entities" : ["iPhone"].
   * if NLP returns 'Entities = []' return 'conversationflow1' else return 'conversationflow2'
   */
  let userflowWithNoEntity = null;
  let userflowWithEntity = null;
  for (var i = 0; i < userFlows.length; i++) {
    var intentMatched = false;
    var matchedEntities = false;

    var nlcArray = userFlows[i].nlc;
    if (nlcArray && nlcArray.length > 0) {
      for (var j = 0; j < nlcArray.length; j++) {
        if (
          nlcArray[j].intent !== null &&
          nlcArray[j].intent.length > 0 &&
          nlcArray[j].entities !== null &&
          nlcArray[j].entities.length === 0
        ) {
          intentMatched = isIntentExist(
            nlcArray[j].intent,
            nlpResponse.intents[0].intent
          );
          matchedEntities = true;
          if (intentMatched && matchedCurrentStep(context, userFlows[i])) {
            userflowWithNoEntity = userFlows[i];
          }
        } else if (
          nlcArray[j].intent !== null &&
          nlcArray[j].intent.length === 0 &&
          nlcArray[j].entities !== null &&
          nlcArray[j].entities.length > 0
        ) {
          userflowWithEntity = userFlows[i];
        } else {
          intentMatched = isIntentExist(
            nlcArray[j].intent,
            nlpResponse.intents[0].intent
          );
          matchedEntities = checkEntitiesExist(nlcArray[j].entities, entities);
          if (intentMatched && matchedEntities && matchedCurrentStep(context, userFlows[i])) {
            userflowWithEntity = userFlows[i];
          }
        }

        if (intentMatched === true || matchedEntities === true) {
          break;
        }
      }
    }
  }

  /**LSLCUSEN-211: Return the userResponses based on matching entites. If exact match is found, use 'userflowWithEntity' object
   * else use 'userflowWithNoEntity' for userResponses.
   */
  if (userflowWithEntity !== null) {
    userResponses = userflowWithEntity;
  } else {
    userResponses = userflowWithNoEntity;
  }

  if (userResponses) {
    context.converseContext.backupContextAdded = false;
    delete context.converseContext.customObject;
    context.converseContext.incomprehension =
      context.converseContext.incomprehension != undefined ? 0 : undefined;
    // If NLP response comes back with entities; update the context object to store the entities returned
    if (context.converseContext.nlpResponse.entities != undefined) {
      context = saveEntitiesJson(context);
    }
    return userResponses.nextSteps;
  } else {
    return null;
  }
}

function matchedCurrentStep(context, userFlow) {
  var matchedCurrentStep = false;
  if (typeof context.converseContext.currentStep === "string") {
    if (
      userFlow.currentStep.includes(
        context.converseContext.currentStep
      )) {
      matchedCurrentStep = true;
    }
  } else {
    // For each possible step flows in context; check if it matched the user flow
    context.converseContext.currentStep.forEach(step => {
      // Check if intent/entity matches for that section of the flow
      if (userFlow.currentStep === step) {
        matchedCurrentStep = true;
      }
    });
  }
  return matchedCurrentStep;
}

function findBotResponse(nextSteps, nlpResponse, botResponses) {
  var response = null;

  var entities = nlpResponse.entities;
  botResponses.forEach(botResponse => {
    var intentMatched = false;
    var matchedEntities = false;

    var nlcArray = botResponse.nlc;
    if (nlcArray && nlcArray.length > 0) {
      nlcArray.some(nlc => {
        if (
          nlc.intent !== null &&
          nlc.intent.length > 0 &&
          nlc.entities !== null &&
          nlc.entities.length === 0
        ) {
          intentMatched = isIntentExist(
            nlc.intent,
            nlpResponse.intents[0].intent
          );
          matchedEntities = true;
        } else if (
          nlc.intent !== null &&
          nlc.intent.length === 0 &&
          nlc.entities !== null &&
          nlc.entities.length > 0
        ) {
          //Not sure how to handle this case
        } else {
          intentMatched = isIntentExist(
            nlc.intent,
            nlpResponse.intents[0].intent
          );
          matchedEntities = checkEntitiesExist(nlc.entities, entities);
        }

        //if  {
        return (intentMatched === true && matchedEntities === true)
        //}
      });
    }

    if (
      botResponse.currentStep === nextSteps[0] &&
      intentMatched &&
      matchedEntities
    ) {
      response = botResponse;
    }
  });

  if (response) {
    return response;
  } else {
    logger.error(
      __filename + " - " + Date.now() + " - Error in finding bot response",
      {
        component: "RESPONSEHANDLER"
      }
    );
    return null;
  }
}

/**
 * @description - function to update saved entities map with newly returned entities from NLP
 * @param {Object} context - main context
 */
function saveEntitiesJson(context) {
  let savedEntitiesJson = context.converseContext.savedEntitiesJson;
  if (savedEntitiesJson === undefined) {
    savedEntitiesJson = {};
  }
  context.converseContext.nlpResponse.entities.forEach(function (entity) {
    savedEntitiesJson[entity.entityName] = entity.entityValue;
  });
  context.converseContext.savedEntitiesJson = savedEntitiesJson;
  return context;
}

/**
 * @description - function to return the correct next step node for Variable decision
 * @param {Object} contextCurrentStep - current step of the passed in current context
 * @param {Object} botConditionResponses - object containing conditional responses of bot
 * @param {Object} botResponseFlows - object containing all possible responses of bot
 * @param {Object} response - object containing evaluated responses
 * @return {Object} nextStepNode - nextStepNode to be executed
 */
function findVariableDecisionNextStep(
  context,
  botConditionResponses,
  botResponseFlows,
  response
) {
  let contextCurrentStep = context.converseContext.currentStep;
  let botConditionResponsesCurrentStep = [];
  let handleErrorStep;
  let noStepsMatched = true; // set default value to true; this will change to false once a step condition is true
  let nextStepNode = null
  // Filter the conditionaEval nodes which belong to the currentStep
  for (let i = 0; i < contextCurrentStep.length; i++) {
    botConditionResponses.find(obj => {
      // Add all condition bot responses for this step except for handleError; as it's handled separately
      if (
        obj.description[0] !== "handleError" &&
        obj.currentStep.includes(contextCurrentStep[i])
      ) {
        botConditionResponsesCurrentStep.push(obj);
      } else if (obj.description[0] === "handleError") {
        const handleErrorConditionStep = obj.nextSteps[0];
        handleErrorStep = botResponseFlows.find(allBotFlows => {
          return allBotFlows.currentStep.includes(handleErrorConditionStep);
        });
      }
    });
  }
  // create the sandbox - pass the response object so sandbox can access it when evaluating the condition expression, also set a timeout for 10 sec in case of infinite loop is added in condition expression block
  var vm = new VM({
    timeout: sandboxTimeout.timeout,
    sandbox: response
  });
  // We loop through the condition responses for the current step and check if the node is the next in the flow to return the response to the user
  for (let i = 0; i < botConditionResponsesCurrentStep.length; i++) {
    try {
      logger.debug(
        "Condition expression: " +
        botConditionResponsesCurrentStep[i].responseConfig.conditionStatement
      );
      // evaluate the condition expression using the sandbox
      if (
        vm.run(
          botConditionResponsesCurrentStep[i].responseConfig.conditionStatement
        )
      ) {
        noStepsMatched = false; // Found a step so set this to false
        nextStepNode = botResponseFlows.find(obj => {
          return (
            obj.currentStep.includes(botConditionResponsesCurrentStep[i].nextSteps[0])
          );
        });
        break;
      }
    } catch (e) {
      logger.error("Syntax Error - problem in evaluating bot condition", e);
      nextStepNode = handleErrorStep; // If it's the last step node with error in condition then take path to handleErrorStep
    }
  }
  /* If none of the conditions are matched or if there was an error calling, and if handeError step exists:
  / Take user to handleError path */
  if (noStepsMatched && handleErrorStep) {
    logger.error("Error in condition statement or API");
    nextStepNode = handleErrorStep;
  }
  return nextStepNode;
}

function isIntentExist(flowIntent, nlpIntent) {
  if (flowIntent === nlpIntent) {
    return true;
  }

  return false;
}

function isMatching(entity, entities) {
  if (entity && entities != undefined && entity.entityName != undefined) {
    var foundEntity = entities.find(function (element) {
      if (entity.entityValue && entity.entityValue !== "") {
        return (
          element.entityName === entity.entityName &&
          element.entityValue === entity.entityValue
        );
      } else {
        return element.entityName === entity.entityName;
      }
    });

    if (foundEntity) {
      return true;
    }
  }

  return false;
}
