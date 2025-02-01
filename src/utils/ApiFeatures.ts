import {Query} from "mongoose";
import { ParsedQs } from "qs";

class ApiFeatures<T extends Document> {
    public query: Query<T[],T>;
public queryString: {[key: string]:  string[] | ParsedQs[] | string | ParsedQs };

    constructor(query: Query<T[],T>, queryString:  {[key: string]:  string[] | ParsedQs[] | string | ParsedQs }){
        this.query = query,
        this.queryString = queryString
    }

    filter(){
        const queryObj = { ...this.queryString }

        // Remove pagination, sorting, and fields from queryObj
        const excFields = ['page','sort','limit','fields'];
        excFields.forEach(field => {delete queryObj[field];});

        // Convert comparison operators to MongoDB format
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    sort() {
        let sortBy = '-createdAt';
        if(typeof this.queryString.sort === 'string'){
            sortBy = this.queryString.sort.split(',').join(" ")
        }
        this.query = this.query.sort(sortBy)
        return this;
    }

    paginate() {
        const page = +this.queryString.page * 1 || 1;
        const limit = +this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }

    limitFields() {
        let fields = '-__v'
        if(typeof this.queryString.fields == 'string'){
            fields = this.queryString.fields.split(',').join(" ");
        }
        this.query = this.query.select(fields);
        return this;
    }

}
export default ApiFeatures;