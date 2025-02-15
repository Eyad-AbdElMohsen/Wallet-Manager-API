import { Query } from "mongoose";
import { ApiFeatures, BaseQueryArgs } from "../../utils/ApiFeatures";

describe("apiFeatures", () => {
    let apiFeatures: ApiFeatures<any>;
    let mockQuery:  Query<any[],any>;
    let queryString: BaseQueryArgs;

    beforeEach(() => {
        mockQuery = {
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
        } as unknown as jest.Mocked<Query<any[], any>>,
        queryString = {
            page: 2,
            limit: 5,
            sort: "name",
            fields: "name,email",
        };
        apiFeatures = new ApiFeatures(mockQuery as Query<any[], any>, queryString);
    });

    let apiFeaturesWithFilter: ApiFeatures<any>;
    let mockFilterQueryString: BaseQueryArgs;

    it("should correctly transform filter query operators", () => {
        mockFilterQueryString = {
            price: "gte:100",
            rating: "lt:4"
        } as any;
    
        apiFeaturesWithFilter = new ApiFeatures(mockQuery as Query<any[], any>, mockFilterQueryString);
        apiFeaturesWithFilter.filter();
    
        expect(mockQuery.find).toHaveBeenCalledWith({
            price: "$gte:100",
            rating: "$lt:4"
        });
    });

    it("should apply filtering correctly", () => {
        apiFeatures.filter();
        expect(mockQuery.find).toHaveBeenCalled();
    });

    it("should apply sorting correctly", () => {
        apiFeatures.sort();
        expect(mockQuery.sort).toHaveBeenCalledWith("name");
    });

    it("should apply pagination correctly", () => {
        apiFeatures.paginate();
        expect(mockQuery.skip).toHaveBeenCalledWith(5);
        expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });

    it("should apply field limiting correctly", () => {
        apiFeatures.limitFields();
        expect(mockQuery.select).toHaveBeenCalledWith("name email");
    });

    it("should set default values if queryString is missing properties", () => {
        const defaultQuery = new ApiFeatures(mockQuery as Query<any[], any>, {});
        expect(defaultQuery.queryString.page).toBe(1);
        expect(defaultQuery.queryString.limit).toBe(10);
        expect(defaultQuery.queryString.sort).toBe("-createdAt");
        expect(defaultQuery.queryString.fields).toBe("-__v");
    });
})