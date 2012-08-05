/**
 * Copyright (c) 2012 Mozart Diniz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author Mozart Diniz
 * Date: 08.05.2012
 * Time: 20:12
 */

var form2json = (function(objParameters){

    var queryString = objParameters.queryString || "input";
    var formFields = document.querySelectorAll(queryString);
    
    /**
    * Return a Array representation of input forms names
    * 
    * @param formFields {NodeList} Collection with all form fields
    */ 

    var collectNames = function(formFields) {
    
        var formFieldsLenght = formFields.length;
        var formNames = [];
        var nameArray = [];
        var delimiter = objParameters.delimiter || ".";
        
        for (var i = 0; i < formFieldsLenght; i++) {
            
            nameArray = formFields[i].name.split(delimiter);
            formNames.push(nameArray);
            
        };
        
        return formNames;
    
    };    
    
    /**
    * Merge diferents objects that represent diferent paths in same object.
    * by example:
    * field_1 name: user.id
    * field_2 name: user.group.id
    *
    * result {
    *           user:{
    *              id: "",
    *              {
    *                 group:{
    *                    id: ""
    *                 }
    *              } 
    *            }
    *          }
    * 
    * @param destination {Object} Current Json path
    * @param source {Object} Json path from a new field name
    */     

    var mergeObjects = function(destination, source) {
                  
      for (var property in source) {
      
        if (source[property] && source[property].constructor && source[property].constructor === Object) {
        
          destination[property] = destination[property] || {};
          
          arguments.callee(destination[property], source[property]);
          
        } else {
          destination[property] = source[property];
        }
      };
      
      return destination;
      
    };
    
    /**
    * Generate Json object
    * 
    * @param nameParts {Array} Nested array with splited names
    */     
    
    var makeJson = (function(nameParts) {

        var namePartsLength = nameParts.length;
        var i = namePartsLength;
        var partialResult = {};
        var innerResult = {};        
        
        var formFieldName = nameParts.join(".");
        
        if (typeof(result) == "undefined") {
            var result = {};
        };
        
        while(i--) {
        
            // nameParts[i] ===  "string" means that theres no children
        
            if (typeof(nameParts[i]) === "string") {                                
                
                //if nameParts array have only one item, get a value from fiels with this name
                
                if (nameParts.length === 1) {
                    result[nameParts[i]] = document.getElementsByName(formFieldName)[0].value;    
                } else {
                    
                    if (Object.keys(innerResult).length === 0) {                                
                               
                        partialResult[nameParts[i]] = document.getElementsByName(formFieldName)[0].value;
                                
                    } else {
                    
                        partialResult[nameParts[i]] = innerResult;
                    
                    }                
                    
                    innerResult = partialResult;        
                    partialResult = {};                                 
                };
                                                
            } else {

               mergeObjects(result, arguments.callee(nameParts[i]));
               
            };
            
        };    
        
        if (Object.keys(innerResult).length === 0) {
            return result;
        } else {
            return innerResult;
        };
    
    });

    console.log(
        makeJson(
            collectNames(formFields)
        )
    );  

});