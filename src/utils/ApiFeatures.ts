import { Query } from "mongoose";

interface BaseQuery {
    page: number,
    sort: string,
    limit: number,
    fields: string
}
interface BaseQueryArgs extends Partial<BaseQuery>{}

class ApiFeatures<T extends Document> {
    public query: Query<T[],T>;
    public queryString: BaseQuery

    constructor(query: Query<T[],T>, queryString: BaseQueryArgs){
        this.query = query,
        this.queryString = {
            ...queryString,
            page: queryString.page ?? 1,
            limit: queryString.limit ?? 10,
            sort: queryString.sort ?? '-createdAt',
            fields: queryString.fields ?? '-__v'
        }
    }

    filter(){
        const queryObj = { ...this.queryString }

        // Remove pagination, sorting, and fields from queryObj
        const excFields = ['page','sort','limit','fields'] as const;
        excFields.forEach(field => {delete queryObj[field]});

        // Convert comparison operators to MongoDB format
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`);
        
        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    sort() {
        const sortBy = this.queryString.sort.split(',').join(" ")
        this.query = this.query.sort(sortBy)
        return this;
    }

    paginate() {
        const page = this.queryString.page;
        const limit = this.queryString.limit;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }

    limitFields() {
        const fields = this.queryString.fields.split(',').join(" ");
        this.query = this.query.select(fields);
        return this;
    }
}

export default ApiFeatures;