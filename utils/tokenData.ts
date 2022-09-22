const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const  create = async (tokenData) => {
  try {
    const fileName = uuidv4();
    const dir = path.join(process.cwd() + `/tokenData`);
    
    const createDirectory = !fs.existsSync(dir) && fs.mkdirSync(dir);
    const file = path.join(dir, `${fileName}.json`);

    let data = JSON.parse(tokenData);
    let themeInfo = {};
    let _obj = [];
    Object.keys(data).map((key) => {
      const value = data[key];
      const names = key.split("/");
      value.map((eachValue) => {
        const secondName = eachValue.name.split(".");
        if(secondName.length === 1) {
          secondName.splice(0, 0, "noGroupName");
        }
        const realNames = names.concat(secondName);

        let res = {};
        let tmp = res;
        for (let i = 0; i < realNames.length; i++) {
          if (i === realNames.length - 1) {
            tmp[realNames[i]] = (({ value, type }) => ({ value, type }))(eachValue);;
          } else {
            tmp[realNames[i]] = {};
          }
          tmp = tmp[realNames[i]];
        }
        _obj.push(res);
        return res;
      });
      
    });
    var _ = require("lodash");
    for (let i = 0; i < _obj.length; i++) {
      _.merge(themeInfo, _obj[i]);
    }

    await fs.writeFileSync(file, JSON.stringify(themeInfo, null, 2));
    return fileName;
  } catch (error) {
    return error;
  }
};

const read = async (fileName) => {
  try{
    const dir = path.join(process.cwd() + `/tokenData`);
    const filePath = path.join(dir, `${fileName}.json`);
    const token = fs.readFileSync(filePath);
    return JSON.parse(token);
  } catch (error){
    return error;
  }
}
export const tokenData = {
  create,
  read,
};