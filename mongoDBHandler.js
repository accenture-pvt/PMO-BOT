var MongoClient = require('mongodb').MongoClient;
var trim = require('trim-whitespace');
var moment = require('moment');
//var distinct = require('distinct');
var unique = require('array-unique');
var url = "mongodb://localhost:27017/";

var collection = "";

var collectionName = "";

var  selectionColumn= "";
var query = "";
var resultArray = "";
let differentDays = 0; 

    module.exports = {
     intocalling: function(entityName,intentName) {
       console.dir(entityName);
       console.log("fffff"+typeof(entityName));
       if(typeof(entityName) != "object")
       {
       entityName = trim(entityName); 
       entityEnterpriseId = entityName;
       console.log("pppp"+entityEnterpriseId);
       }
       else{
         console.log("gggggggg"+entityName[0]);
       entityEnterpriseId = trim(entityName[0]);
       if(typeof entityName[1] !== 'undefined' && entityName[1]){ 
       date1 = trim(entityName[1]); 
       }
       if(typeof entityName[2] !== 'undefined' && entityName[2]){ 
       date2 = trim(entityName[2]); 
       }
      // console.log(entityName[0]);
       }
       return MongoClient.connect(url).then(function(db) {
          var dbo = db.db("PMO-BOT1");
          // if(intentName == "Certification")
          // {
          //   var collectionName = "certification-pmo";
           
          //   var selectionColumn = {"certification_name":1,"completion_date":1,"valid_till":1};
          // }
          if(intentName == "Certification")
          {
            var collectionName = "Employee";
           
            var selectionColumn = {"certification.certification_name":1,"certification.completion_date":1,"certification.valid_till":1};
          }
          else if(intentName == "currentInitiative")
          {
            //var collectionName = "currentInitiative_pmo";
            var collectionName = "Employee";
            var selectionColumn = {"initiative.initiative_name":1};
          }
          else if(intentName == "performanceReviewer")
          {
            var collectionName = "Employee";
            //var collectionName = "performance_reviewer_pmo";
            var selectionColumn = {"performance_reviewer_name":1};
          }
          else if(intentName == "previousInitiative")
          {
            var collectionName = "Employee";
            //var collectionName = "previous_initiative_pmo";
            var selectionColumn = {"initiative_name":1};
          }
          else if(intentName == "projectSort")
          {
            var collectionName = "Employee";
            // var collectionName = "currentInitiative_pmo";
            var selectionColumn = {"emp_id":1};
          }
          // else if(intentName == "SkillSet")
          // {
          //   var collectionName = "Personal_details_pmo";
          //   var selectionColumn = {"emp_id":1, "designationEmp":1, "workDetails":1};
          //   //var collectionName1 = "rollOnPeople";
          //   //var selectionColumn1 = {"RollOff":1};
          // }

          else if(intentName == "SkillSet")
          {
            var collectionName = "Employee";
            var selectionColumn = {"emp_id":1, "designationEmp":1, "workDetails":1, "roll.RollOff":1};
            //var collectionName1 = "rollOnPeople";
            //var selectionColumn1 = {"RollOff":1};
          }
          else if(intentName == "empLoc")
          {
            //var collectionName = "Personal_details_pmo";
            var collectionName = "Employee";
            var selectionColumn = {"emp_id":1, "designationEmp":1, "primarySkill":1, "roll.RollOff":1};
          }
          // else if(intentName == "SkillLoc")
          // {
          //   var collectionName = "Personal_details_pmo";
          //   var selectionColumn = {"primarySkill":1};
          // }
          else if(intentName == "SkillLoc")
          {
            var collectionName = "Employee";
            var selectionColumn = {"primarySkill":1};
          }

          
          else if(intentName == "timeSheetReviewer")
          {
            var collectionName = "Employee";
            //var collectionName = "Personal_details_pmo";
            var selectionColumn = {"timesheetReviewer":1};
          }
          else if(intentName == "skills")
          {
            var collectionName = "Employee";
           // var collectionName = "Personal_details_pmo";
            var selectionColumn = {"primarySkill":1,"secondarySkill":1};
          }
          else if(intentName == "workDetails")
          {
            //var collectionName = "Personal_details_pmo";
            var collectionName = "Employee";
            var selectionColumn = {"workDetails":1};
          }
          else if(intentName == "designationEmp")
          {
            //var collectionName = "Personal_details_pmo";
            var collectionName = "Employee";
            var selectionColumn = {"designationEmp":1};
          }
          else if(intentName == "employeeID")
          {
            var collectionName = "Personal_details_pmo";
            var selectionColumn = {"emp_id":1};
          }
          else if(intentName == "DOJ")
          {
           // var collectionName = "Personal_details_pmo";
            var collectionName = "Employee";
            var selectionColumn = {"DOJ":1};
          }
          else if(intentName == "contact")
          {
            //var collectionName = "Personal_details_pmo";
            var collectionName = "Employee";
            var selectionColumn = {"contact":1};
          }

          else if(intentName == "vacationRequest")
         {
          var collectionName = "Employee1";
          //var collectionName = "leave_email_classification_pmo";
          var selectionColumn = {"email_type":1};
          }
          else if(intentName == "wfhRequest")
          {
          var collectionName = "Employee1";
            //var collectionName = "leave_email_classification_pmo";
          var selectionColumn = {"email_type":1};
          } 
          else if(intentName == "VacationPTO")
         {
          var collectionName = "Employee1"; 
          //var collectionName = "leave_email_classification_pmo";
           var selectionColumn = {"leave_start_date":1,"leave_end_date":1,"email_type":1};
         } 
         else if(intentName == "wfhDayCounts")
         {
          var collectionName = "Employee1"; 
          //var collectionName = "leave_email_classification_pmo";
           var selectionColumn = {"leave_start_date":1,"leave_end_date":1,"email_type":1};
         } 
         else if(intentName == "rollOnPeople")
          { 
          //var collectionName = "rollOnPeople";
          var collectionName = "Employee";
          var selectionColumn = {"roll.RollOn":1};
         } 
         else if(intentName == "rollOffPeople")
         { 
          var collectionName = "Employee";
          //var collectionName = "rollOnPeople";
         var selectionColumn = {"roll.RollOff":1};
        } 
         else if(intentName == "supervisorDetails")
         { 
         //var collectionName = "Personal_details_pmo";
         var collectionName = "Employee";
         var selectionColumn = {"supervisorId":1};
        } 
        
        
        // if(intentName == "SkillSet")
        // {
        //  collection = dbo.collection('Personal_details_pmo').aggregate([
        //   { $lookup:
        //       {
        //        from: 'rollOnPeople',
        //         localField: 'emp_id',
        //         foreignField: 'emp_id',
        //         as: 'RollOff'
        //      }
        //     }
        //   ]).toArray(function(err,  res) {
        //     if (err) throw err;
        //     // console.log(JSON.stringify(res));
        //    //  db.close();
        //   });
        //   console.log("hiBot")
        // }
       // else{
          collection = dbo.collection(collectionName); 
        //}
          console.log("==>"+collectionName);
      var items = null;
      var err = null;
      //trim(entityName);
      
       // let query = {"emp_id":entityName};
       
       if(intentName == "projectSort")
      {
         query = {"initiative_name":entityName};
      }
      else if(intentName == "SkillSet")
      {
         query = {"primarySkill":{'$regex':entityName,$options:'i'}};
        
        // query1 = {"emp_id":new RegExp(employee_id)};
         
      }
      else if(intentName == "empLoc")
      {
         query = {"workDetails":new RegExp(entityName)};
      }
      else if(intentName == "SkillLoc")
      {
         query = {"workDetails":new RegExp(entityName)};
      }
      
      
      else if(intentName == "wfhRequest" || intentName == "vacationRequest" || intentName == "VacationPTO" || intentName == "wfhDayCounts")
      {
       console.log("xyz");
       console.log("oooo"+typeof date1);
       if(typeof date1 !== 'undefined' &&  typeof date2 !== 'undefined'){
        if (new Date(date1) < new Date(date2) == true)
        {
          console.log("inside");
        entityStartDate = date1;
        entityEndDate = date2;
        console.log("==>"+entityStartDate+"==="+entityEndDate+"<==");
        }
        else
        {
          entityStartDate = date2;
          entityEndDate = date1;
          console.log("==>"+entityStartDate+"==="+entityEndDate+"<==");
        }
        // query = {"emp_id":entityEnterpriseId,"leave_start_date":{$gte:entityStartDate},"leave_end_date":{$lte:entityEndDate},"email_type":"WFH"}
        
        if(intentName === "wfhRequest" || intentName === "wfhDayCounts"){
        query = {"emp_id":new RegExp(entityEnterpriseId),"leave_start_date":{$gte:entityStartDate},"leave_end_date":{$lte:entityEndDate},"email_type":"WFH"};
        }
        else{
          console.log("vacation");
          query ={"emp_id":new RegExp(entityEnterpriseId),"leave_start_date":{$gte:entityStartDate},"leave_end_date":{$lte:entityEndDate},"email_type":"vacation"};
 
        }
     
        console.log("wfh"+query);
      }      
        else {
         //query = {"emp_id":entityEnterpriseId};
         query = {"emp_id":new RegExp(entityEnterpriseId)};
        //query = {emp_id:'/'+entityEnterpriseId+'/'};
        }
      }
      else {
          //query = {"emp_id":entityName};
          query={"emp_id":new RegExp(entityName)};
          // console.log("My Query" + query);
        // console.log("Checking entity" +entityName);
        // var test='/'+entityName+'/';
        // console.log('testing' + test);
        // query = {'emp_id':test};
        //console.log("My Query" + query);
      }
         //query = {"emp_id":entityName};
//console.log(selectionColumn + " " + entityName + " " + collectionName);


//try
// return collection.find((query,selectionColumn).toArray((err, items)){
//        collection1.find((query1,selectionColumn1).toArray((err, items)){
//  })
// })

//

    //  if(intentName = "SkillLoc"){
    //   return collection.distinct(selectionColumn,query)
    //  }
    //  else{
      if(intentName === "SkillLoc"){
        return collection.distinct('primarySkill',query);
       }
       else{
      return collection.find(query,selectionColumn).toArray((err, items))
       }
  
       }).then(function(res) {
        
        console.log("length"+res.length);
        var finalResult = "";
         var count=0;
         var count1 = 0;
         var count2 = 0;
         //var i = 0;
          var totalResultCount =res.length;
          console.log("====>"+totalResultCount);
          console.log("result"+res);
         res.forEach(function (resultData) {
          
         // console.log("data"+resultData);
         // if(resultData[1] !== 'undefined'){
          count = count+1;
          //}
         // else{
           // count = count+0;
          //}
          var i = 0;
          i = count;
          console.log("count"+i);
          if(intentName == "Certification")
          {
            var resultArray = "";
            var i = 0;
            console.log("qpoweur");
            console.log("length"+resultData.length);
            
            for(var data of resultData.certification) {
                 console.log("datalength"+data.length);
                  console.log("name"+data.certification_name);

              if(typeof data.certification_name !== 'undefined'){
                count2 = count2+1;
                console.log("count2"+count2);
               resultArray =  resultArray + "<tr><td style='padding-left:5px;width:10%'>" + count2 + "." +" </td><td style='padding-left:5px;width:30%'> " + data.certification_name + "</td><td style='padding-left:5px;width:30%'> " + moment(data.completion_date).format(" DD/MM/YYYY ") + "</td><td style='padding-left:5px;width:30%'> " + moment(data.valid_till).format(" DD/MM/YYYY ") + "</td></tr>";
//resultArray = resultArray + "\n" +  count2 + "." + data.certification_name +" completed on "+ moment(data.completion_date).format(" DD/MM/YYYY ")+" and valid till "+moment(data.valid_till).format(" DD/MM/YYYY ");
              }
              else{
               // count1 = count1+0;
               resultArray = "";
              }
              i = count2;
              count=i;
              //i = count;
                //  count = count + 1;
              //}
           // resultData.certification.forEach(){
           // resultArray = resultArray + "\n" + data.certification_name +" completed on "+ moment(data.completion_date).format(" DD/MM/YYYY ")+" and valid till "+moment(data.valid_till).format(" DD/MM/YYYY ");
          //  var resultArray = certification_name;
                          
                        }
                     
                    //  i = count;
         // }
        }
          else if(intentName == "currentInitiative")
          {
            var resultArray = "";
            var i = 0;
           // var totalResultCount =i;
            console.log("qpoweur");
            console.log("length"+resultData.initiative.length);
            
            for(var data of resultData.initiative) {
                 console.log("datalength"+data.length);
                 console.log("name"+data.initiative_name);
              
                resultArray =  resultArray + "\n" + (i+1) + "." + data.initiative_name;
                i=i+1;
              

              // if(typeof data.initiative_name !== 'undefined'){
              //   count2 = count2+1;
              //   console.log("count2"+count2);
              //  resultArray = resultArray + "\n" + data.initiative_name;
              // }
              // else{
              //  // count1 = count1+0;
              //  resultArray = "";
              // }
              // i = count2;
              // count=i;
             // totalResultCount = totalResultCount + i;
          }
          
          count = i;
        }
          
          else if(intentName == "performanceReviewer")
          {
            var resultArray = resultData.performance_reviewer_name;
          }
          else if(intentName == "previousInitiative")
          {
            var i = 0;
            var resultArray = (i+1) + "." + resultData.initiative_name;
          }
          else if(intentName == "projectSort")
          {
            var resultArray = resultData.emp_id;
          }
          else if(intentName == "SkillSet")
          {
            //console.log("rolloff"+resultData.RollOff);
            var resultArray = "<td style='padding-left:5px;width:30%'>"+ resultData.emp_id+ "</td><td style='padding-left:5px;width:15%'> "+resultData.designationEmp+" </td><td style='padding-left:5px;width:20%'> "+resultData.workDetails+" </td><td style='padding-left:5px;width:25%'> "+resultData.roll.RollOff+"</td></tr>";
            //var employee_id = resultData.emp_id;
          }
          else if(intentName == "empLoc")
          {
            var resultArray ="<td style='padding-left:5px;width:30%'>"+ resultData.emp_id+ " </td><td style='padding-left:5px;width:15%'> "+resultData.designationEmp+" </td><td style='padding-left:5px;width:20%'> "+resultData.primarySkill+" </td><td style='padding-left:5px;width:25%'> "+resultData.roll.RollOff+"</td></tr>"; 
  
            //var resultArray = resultData.emp_id+ " - "+resultData.designationEmp+" - "+resultData.primarySkill+" - "+resultData.roll.RollOff;
          }
          else if(intentName == "SkillLoc")
          {

            console.log("typeofprimaryskill"+  resultData);

             this.resultArray = [];
            if(this.resultArray.indexOf(resultData) == -1) {
              this.resultArray.push(resultData);
              count1 = count1+1;
              console.log("cccount"+count1);
              console.log("tttttthis"+this.resultArray);
            }
            var i = count1;
          //  console.log("typeofprimaryskill"+  resultData);
           
            // if(typeof resultData.primarySkill !== 'undefined'){
            //   count1 = count1+1;
            //   console.log("count1"+count1);
            //   console.log("result"+ typeof resultData.primarySkill);
            //   //var resultArray = unique(resultData);
            //   var resultArray = [];
            //   resultArray = unique(resultData);
              // var j = 0;
              // resultData.forEach(function(primarySkill){ 
              //   for(var data of resultData){
              //   resultArray[j] = data.primarySkill;
              //  // console.log("primaryobject" + typeof obj);
              //   j = j+1;
              //   console.log("primary"+data.primarySkill);
              //    }
              // var resultArray = resultArray1.primarySkill;
              // resultArray = unique(resultArray);
              //onsole.log("eresult"+resultArray);
              //var resultArray = resultData.primarySkill;

            // }
            // else{
            //  // count1 = count1+0;
            //   var resultArray = "";
            // }
            // var i = count1;
          }
          
          

          else if(intentName == "timeSheetReviewer")
          {
            var resultArray = resultData.timesheetReviewer;
          }
          else if(intentName == "skills")
          {
            //var resultArray = resultData.primarySkill;
            var resultArray = "the primary skill - " + resultData.primarySkill+ " and secondary skill - " + resultData.secondarySkill;
           // var resultArray1 = resultData.secondarySkill;

          }
          else if(intentName == "workDetails")
          {
            var resultArray = resultData.workDetails;
          }
          else if(intentName == "designationEmp")
          {
            var resultArray = resultData.designationEmp;
          }
          else if(intentName == "employeeID")
          {
            var resultArray = resultData.emp_id;
          }
          else if(intentName == "DOJ")
          {
            var resultArray = resultData.DOJ;
          }
          else if(intentName == "contact")
          {
            var resultArray = resultData.contact;
          }
          // else if(intentName == "wfhRequest")
          // {
          // var resultArray = resultData.vacation.email_type;
          // }
          else if(intentName == "vacationRequest" || intentName == "wfhRequest")
          {
            var resultArray="";
            //var i = 0;
            console.log("intennnn"+resultData);
              //for(var data of resultData.vacation) {
              console.log("datalength"+resultData.length);
               console.log("name"+resultData.email_type);

           if(typeof resultData.email_type !== 'undefined'){
             count2 = count2+1;
             console.log("count2"+count2);
            resultArray = resultArray + resultData.email_type;
           }
           else{
            // count1 = count1+0;
            resultArray = "";
           }
          // i = count2;
           count=i;
          //}
          //var resultArray = resultData.vacation.email_type;
          } 
          else if(intentName == "supervisorDetails")
          {
          var resultArray = resultData.supervisorId;
          }
        
          // else if(intentName == "VacationPTO" ||  intentName == "wfhDayCounts")
          // {
 
          // let firstDate = new Date(resultData.leave_start_date),
          // secondDate = new Date(resultData.leave_end_date),
          // timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
          // console.log(timeDifference);
 
          // let differentDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
          // console.log(differentDays);
          // //var resultArray = differentDays;
          // var resultArray = differentDays + " " + " and the leave was requested from " + firstDate + " to " + secondDate 
          // } 
          else if(intentName == "VacationPTO" || intentName == "wfhDayCounts")
            {
             var resultArray="";
             var numberofDays=0;
             // var i = 0;
            // let differentDays = 0; 
              console.log("intentname"+intentName);
             // console.log("email"+resultData.vacation.email_type);
             
             // console.dir(resultData,{depth:20}) 
 


              console.log("resultdata"+resultData);
             // for(var data of resultData.vacation) {
              //console.log("datalength"+data.length);
                // console.log("name"+data.email_type);
              console.log("email1"+ resultData.leave_start_date);
              if(typeof resultData.leave_start_date !== 'undefined' &&  typeof resultData.leave_end_date !== 'undefined'){
            // if(typeof data.email_type !== 'undefined'){
               //count2 = count2+1;
              // console.log("count2"+data);

               let firstDate =
               new Date(resultData.leave_start_date),
               
               secondDate = 
               new Date(resultData.leave_end_date),
               
               timeDifference = 
               Math.abs(secondDate.getTime() -
               firstDate.getTime())+1;
               
               console.log("firstDate"+firstDate);
               
               console.log("secondDate"+secondDate);
               
               // console.log(timeDifference);
             
               
               
               differentDays = differentDays +
               Math.ceil(timeDifference / (1000 *
               3600 * 24));
               
               console.log(differentDays);
              // i++;
               
               // var resultArray = differentDays ; 
               
               let firstDate1 =
               moment(firstDate).format(" DD/MM/YYYY ")
               
               console.log(firstDate1);
               
               let secondDate1 =
               moment(secondDate).format(" DD/MM/YYYY ")
               
               console.log(secondDate1);
               
               
                resultArray = resultArray + "\n" +
                
               firstDate1 + " to " + 
               secondDate1;
               numberofDays=differentDays;
               
             // resultArray = resultArray + resultData.vacation.email_type;
             }
             else{
               console.log("else");
              // count1 = count1+0;
              resultArray = "";
             }
            
             //i = count2;
            // count=i;
//}
              






            // let firstDate =
            // new Date(resultData.vacation.leave_start_date),
            
            // secondDate = 
            // new Date(resultData.vacation.leave_end_date),
            
            // timeDifference = 
            // Math.abs(secondDate.getTime() -
            // firstDate.getTime())+1;
            
            // console.log("firstDate"+firstDate);
            
            // console.log("secondDate"+secondDate);
            
            // // console.log(timeDifference);
            
            
            
            // let differentDays =
            // Math.ceil(timeDifference / (1000 *
            // 3600 * 24));
            
            // console.log(differentDays);
            
            // // var resultArray = differentDays ; 
            
            // let firstDate1 =
            // moment(firstDate).format(" DD/MM/YYYY ")
            
            // console.log(firstDate1);
            
            // let secondDate1 =
            // moment(secondDate).format(" DD/MM/YYYY ")
            
            // console.log(secondDate1);
            
            
            // var resultArray =
            // differentDays + " " +
            // " and requested from " + 
            // firstDate1 + " to " + 
            // secondDate1 
            
            }
          else if(intentName == "rollOnPeople")
          {
          var resultArray = resultData.roll.RollOn;
          } 
          else if(intentName == "rollOffPeople")
          {
          var resultArray = resultData.roll.RollOff;
          } 



          
           var appendNumber = ""; 
          if(totalResultCount > 1 ){
            console.log("iiiiiii"+i);
            if(intentName == "empLoc" || intentName == "SkillSet"){
           appendNumber = "<tr><td style='padding-left:5px;width:10%'>" + appendNumber+""+i+".</td>";
            }
            else{
              appendNumber =  appendNumber+""+i+".";
            }
            }
          else
           {
             appendNumber = ""; 

           }
          

           //if(intentName == "skills"){
            //finalResult = finalResult+" "+appendNumber+" "+resultArray+ "," +resultArray1+"\n";
          // }
          // else
     //  finalResult = finalResult+" "+appendNumber+" "+resultArray+"\n";
     console.log("finalresult"+resultArray);
     if(resultArray !== "")
     {
    // finalResult = finalResult+" "+appendNumber+" "+resultArray+"\n";
   if(intentName === "VacationPTO" || intentName === "wfhDayCounts"){
     finalResult = finalResult+" "+numberofDays+" "+ " requested from " + " " + resultArray+"\n";
     }
     else if(intentName === "SkillLoc"){
      finalResult = finalResult+" "+appendNumber+" "+this.resultArray+"\n";
      }
    else{
     finalResult = finalResult+" "+appendNumber+" "+resultArray+"\n";
     }
    }
     else{
      finalResult = finalResult+" "+resultArray;
     }
         });
         console.log("aa"+finalResult);

            return [finalResult,count];
       });
     }
   };
   
//module.exports.intocalling = intocalling;