import axios from "axios";
import { baseUrl, corsProxy, querySizeLimit } from "../globals";

vi.mock("axios");

// Must import after mocking axios
const { datastore } = await import("../datastore");

beforeEach(() => {
    // Reset the singleton state before each test
    datastore.auth = { token: "test-token-123" };
    datastore.driveToken = null;
    datastore.models = {};
    datastore.tests = {};
    datastore.summary_results = {};
    datastore.extended_results = {};
    datastore.projects = [];
    datastore.comments = {};
    datastore.vocab = null;
    datastore.queries = { models: {}, tests: {} };
    vi.clearAllMocks();
});

describe("DataStore constructor", () => {
    it("initializes with the correct baseUrl", () => {
        expect(datastore.baseUrl).toBe(baseUrl);
    });

    it("starts with empty caches", () => {
        expect(datastore.models).toEqual({});
        expect(datastore.tests).toEqual({});
        expect(datastore.summary_results).toEqual({});
        expect(datastore.extended_results).toEqual({});
        expect(datastore.projects).toEqual([]);
        expect(datastore.comments).toEqual({});
        expect(datastore.vocab).toBeNull();
    });
});

describe("getRequestConfig", () => {
    it("returns config with Authorization header", () => {
        const config = datastore.getRequestConfig();
        expect(config.headers.Authorization).toBe("Bearer test-token-123");
    });

    it("includes cancelToken when source is provided", () => {
        const source = { token: "cancel-token" };
        const config = datastore.getRequestConfig(source);
        expect(config.cancelToken).toBe("cancel-token");
    });

    it("does not include cancelToken when source is null", () => {
        const config = datastore.getRequestConfig();
        expect(config.cancelToken).toBeUndefined();
    });
});

describe("HTTP methods", () => {
    it("get calls axios.get with correct args", async () => {
        axios.get.mockResolvedValue({ data: "ok" });
        await datastore.get("http://example.com");
        expect(axios.get).toHaveBeenCalledWith(
            "http://example.com",
            expect.objectContaining({ headers: { Authorization: "Bearer test-token-123" } })
        );
    });

    it("post calls axios.post with Content-type header", async () => {
        axios.post.mockResolvedValue({ data: "ok" });
        await datastore.post("http://example.com", { key: "val" });
        expect(axios.post).toHaveBeenCalledWith(
            "http://example.com",
            { key: "val" },
            expect.objectContaining({
                headers: {
                    Authorization: "Bearer test-token-123",
                    "Content-type": "application/json",
                },
            })
        );
    });

    it("put calls axios.put with Content-type header", async () => {
        axios.put.mockResolvedValue({ data: "ok" });
        await datastore.put("http://example.com", { key: "val" });
        expect(axios.put).toHaveBeenCalledWith(
            "http://example.com",
            { key: "val" },
            expect.objectContaining({
                headers: {
                    Authorization: "Bearer test-token-123",
                    "Content-type": "application/json",
                },
            })
        );
    });

    it("delete calls axios.delete with correct args", async () => {
        axios.delete.mockResolvedValue({ data: "ok" });
        await datastore.delete("http://example.com");
        expect(axios.delete).toHaveBeenCalledWith(
            "http://example.com",
            expect.objectContaining({ headers: { Authorization: "Bearer test-token-123" } })
        );
    });
});

describe("getDriveToken", () => {
    it("fetches drive token from API when not cached", async () => {
        axios.get.mockResolvedValue({ text: "drive-token-abc" });
        const token = await datastore.getDriveToken();
        expect(token).toBe("drive-token-abc");
        expect(axios.get).toHaveBeenCalledWith(
            corsProxy + "https://drive.ebrains.eu/api2/account/token/",
            expect.any(Object)
        );
    });

    it("returns cached drive token on second call", async () => {
        datastore.driveToken = "cached-token";
        const token = await datastore.getDriveToken();
        expect(token).toBe("cached-token");
        expect(axios.get).not.toHaveBeenCalled();
    });
});

describe("queryModels", () => {
    const filters = { species: ["mouse"], brain_region: ["hippocampus"] };
    const mockModels = [
        { id: "model-1", name: "Model 1" },
        { id: "model-2", name: "Model 2" },
    ];

    it("fetches models from API on cache miss", async () => {
        axios.get.mockResolvedValue({ data: mockModels });
        const result = await datastore.queryModels(filters);

        expect(axios.get).toHaveBeenCalledTimes(1);
        const url = axios.get.mock.calls[0][0];
        expect(url).toContain("/models/?");
        expect(url).toContain("size=" + querySizeLimit);
        expect(url).toContain("summary=true");

        expect(result).toHaveLength(2);
        expect(result[0].loadedResults).toBe(false);
        expect(result[0].loadedVersions).toBe(false);
        expect(result[0].instances).toEqual([]);
        expect(result[0].results).toEqual([]);
    });

    it("stores fetched models in the cache", async () => {
        axios.get.mockResolvedValue({ data: mockModels });
        await datastore.queryModels(filters);

        expect(datastore.models["model-1"]).toBeDefined();
        expect(datastore.models["model-2"]).toBeDefined();
    });

    it("returns cached models on cache hit", async () => {
        axios.get.mockResolvedValue({ data: mockModels });
        await datastore.queryModels(filters);
        vi.clearAllMocks();

        const result = await datastore.queryModels(filters);
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe("model-1");
    });
});

describe("getModel", () => {
    const mockModel = {
        id: "abc-123",
        alias: "my-model",
        name: "Test Model",
        instances: [{ id: "inst-1" }],
    };

    it("fetches a model by UUID on cache miss", async () => {
        axios.get.mockResolvedValue({ data: mockModel });
        const result = await datastore.getModel("abc-123");

        expect(axios.get).toHaveBeenCalledWith(
            baseUrl + "/models/abc-123",
            expect.any(Object)
        );
        expect(result.loadedVersions).toBe(true);
        expect(result.loadedResults).toBe(false);
        expect(result.results).toEqual([]);
    });

    it("returns cached model when already loaded with versions", async () => {
        datastore.models["abc-123"] = { ...mockModel, loadedVersions: true };
        const result = await datastore.getModel("abc-123");

        expect(axios.get).not.toHaveBeenCalled();
        expect(result.id).toBe("abc-123");
    });

    it("re-fetches model when cached without loadedVersions", async () => {
        datastore.models["abc-123"] = { ...mockModel, loadedVersions: false };
        axios.get.mockResolvedValue({ data: mockModel });
        const result = await datastore.getModel("abc-123");

        expect(axios.get).toHaveBeenCalled();
    });

    it("throws error when returned id does not match identifier", async () => {
        axios.get.mockResolvedValue({ data: { id: "wrong-id", alias: "wrong-alias" } });
        await expect(datastore.getModel("abc-123")).rejects.toThrow(
            "doesn't match requested identifier"
        );
    });
});

describe("modelAliasIsUnique", () => {
    it("returns false when alias already exists", async () => {
        // getModel resolves => alias is taken
        datastore.models["my-alias"] = { loadedVersions: true, id: "my-alias", alias: "my-alias" };
        const result = await datastore.modelAliasIsUnique("my-alias");
        expect(result).toBe(false);
    });

    it("returns true when alias does not exist", async () => {
        axios.get.mockRejectedValue(new Error("Not found"));
        axios.isCancel = vi.fn().mockReturnValue(false);
        const result = await datastore.modelAliasIsUnique("unique-alias");
        expect(result).toBe(true);
    });
});

describe("createModel", () => {
    it("posts model data and caches the result", async () => {
        const newModel = { id: "new-1", name: "New Model", instances: null };
        axios.post.mockResolvedValue({ data: newModel });

        const result = await datastore.createModel({ name: "New Model" });
        expect(result.loadedResults).toBe(true);
        expect(result.loadedVersions).toBe(true);
        expect(result.instances).toEqual([]);
        expect(result.results).toEqual([]);
        expect(datastore.models["new-1"]).toBe(result);
    });
});

describe("updateModel", () => {
    it("puts model data and updates cache", async () => {
        const updatedModel = { id: "m-1", name: "Updated", instances: [{ id: "i1" }] };
        axios.put.mockResolvedValue({ data: updatedModel });

        const result = await datastore.updateModel({ id: "m-1", name: "Updated" });
        expect(result.loadedVersions).toBe(true);
        expect(result.loadedResults).toBe(false);
        expect(datastore.models["m-1"]).toBe(result);
    });

    it("sets instances to empty array when null", async () => {
        axios.put.mockResolvedValue({ data: { id: "m-2", instances: null } });
        const result = await datastore.updateModel({ id: "m-2" });
        expect(result.instances).toEqual([]);
    });
});

describe("createModelInstance", () => {
    it("posts instance data and pushes to model instances", async () => {
        datastore.models["m-1"] = { id: "m-1", instances: [] };
        const newInstance = { id: "inst-1", version: "1.0" };
        axios.post.mockResolvedValue({ data: newInstance });

        const result = await datastore.createModelInstance("m-1", { version: "1.0" });
        expect(result).toEqual(newInstance);
        expect(datastore.models["m-1"].instances).toContainEqual(newInstance);
    });
});

describe("updateModelInstance", () => {
    it("updates instance in model's instances array", async () => {
        datastore.models["m-1"] = {
            id: "m-1",
            instances: [{ id: "inst-1", version: "1.0" }, { id: "inst-2", version: "2.0" }],
        };
        const updated = { id: "inst-1", version: "1.1" };
        axios.put.mockResolvedValue({ data: updated });

        const result = await datastore.updateModelInstance("m-1", { id: "inst-1", version: "1.1" });
        expect(result).toEqual(updated);
        expect(datastore.models["m-1"].instances[0]).toEqual(updated);
        expect(datastore.models["m-1"].instances[1].version).toBe("2.0");
    });
});

describe("getTest", () => {
    const mockTest = { id: "test-1", alias: "my-test", name: "Test 1" };

    it("fetches a test on cache miss", async () => {
        axios.get.mockResolvedValue({ data: mockTest });
        const result = await datastore.getTest("test-1");

        expect(axios.get).toHaveBeenCalledWith(baseUrl + "/tests/test-1", expect.any(Object));
        expect(result.loadedVersions).toBe(true);
        expect(result.loadedResults).toBe(false);
        expect(result.results).toEqual([]);
    });

    it("returns cached test when already loaded", async () => {
        datastore.tests["test-1"] = { ...mockTest, loadedVersions: true };
        const result = await datastore.getTest("test-1");
        expect(axios.get).not.toHaveBeenCalled();
    });

    it("throws when returned id does not match", async () => {
        axios.get.mockResolvedValue({ data: { id: "wrong", alias: "also-wrong" } });
        await expect(datastore.getTest("test-1")).rejects.toThrow("doesn't match");
    });
});

describe("queryTests", () => {
    const filters = { test_type: ["network"] };
    const mockTests = [
        { id: "t-1", name: "Test 1" },
        { id: "t-2", name: "Test 2" },
    ];

    it("fetches tests from API on cache miss", async () => {
        axios.get.mockResolvedValue({ data: mockTests });
        const result = await datastore.queryTests(filters);

        expect(result).toHaveLength(2);
        expect(result[0].loadedVersions).toBe(false);
        expect(result[0].loadedResults).toBe(false);
        expect(result[0].instances).toEqual([]);
        expect(result[0].results).toEqual([]);
    });

    it("returns cached tests on cache hit", async () => {
        axios.get.mockResolvedValue({ data: mockTests });
        await datastore.queryTests(filters);
        vi.clearAllMocks();

        const result = await datastore.queryTests(filters);
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toHaveLength(2);
    });
});

describe("testAliasIsUnique", () => {
    it("returns false when alias exists", async () => {
        datastore.tests["my-test"] = { loadedVersions: true, id: "my-test", alias: "my-test" };
        const result = await datastore.testAliasIsUnique("my-test");
        expect(result).toBe(false);
    });

    it("returns true when alias does not exist", async () => {
        axios.get.mockRejectedValue(new Error("Not found"));
        axios.isCancel = vi.fn().mockReturnValue(false);
        const result = await datastore.testAliasIsUnique("unique-test");
        expect(result).toBe(true);
    });
});

describe("createTest", () => {
    it("posts test data and caches result", async () => {
        const newTest = { id: "t-new", name: "New Test", instances: null };
        axios.post.mockResolvedValue({ data: newTest });

        const result = await datastore.createTest({ name: "New Test" });
        expect(result.loadedResults).toBe(true);
        expect(result.loadedVersions).toBe(true);
        expect(result.instances).toEqual([]);
        expect(result.results).toEqual([]);
        expect(datastore.tests["t-new"]).toBe(result);
    });
});

describe("updateTest", () => {
    it("puts test data and updates cache", async () => {
        const updated = { id: "t-1", name: "Updated Test", instances: [{ id: "ti-1" }] };
        axios.put.mockResolvedValue({ data: updated });

        const result = await datastore.updateTest({ id: "t-1" });
        expect(result.loadedVersions).toBe(true);
        expect(result.loadedResults).toBe(false);
        expect(datastore.tests["t-1"]).toBe(result);
    });
});

describe("createTestInstance", () => {
    it("posts instance and pushes to test instances", async () => {
        datastore.tests["t-1"] = { id: "t-1", instances: [] };
        const newInstance = { id: "ti-1", version: "1.0" };
        axios.post.mockResolvedValue({ data: newInstance });

        const result = await datastore.createTestInstance("t-1", { version: "1.0" });
        expect(result).toEqual(newInstance);
        expect(datastore.tests["t-1"].instances).toContainEqual(newInstance);
    });
});

describe("updateTestInstance", () => {
    it("updates instance in test's instances array", async () => {
        datastore.tests["t-1"] = {
            id: "t-1",
            instances: [{ id: "ti-1", version: "1.0" }, { id: "ti-2", version: "2.0" }],
        };
        const updated = { id: "ti-1", version: "1.1" };
        axios.put.mockResolvedValue({ data: updated });

        const result = await datastore.updateTestInstance("t-1", { id: "ti-1", version: "1.1" });
        expect(result).toEqual(updated);
        expect(datastore.tests["t-1"].instances[0]).toEqual(updated);
    });
});

describe("getProjects", () => {
    it("fetches projects from API when not cached", async () => {
        axios.get.mockResolvedValue({
            data: [{ project_id: "proj-1" }, { project_id: "proj-2" }],
        });
        const result = await datastore.getProjects();
        expect(result).toEqual(["proj-1", "proj-2"]);
        expect(datastore.projects).toEqual(["proj-1", "proj-2"]);
    });

    it("returns cached projects on second call", async () => {
        datastore.projects = ["proj-cached"];
        const result = await datastore.getProjects();
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual(["proj-cached"]);
    });
});

describe("getResultsByModel", () => {
    it("fetches results on cache miss", async () => {
        datastore.models["m-1"] = { id: "m-1", loadedResults: false, results: [] };
        const mockResults = [
            { id: "r-1", score: 0.5 },
            { id: "r-2", score: 0.8 },
        ];
        axios.get.mockResolvedValue({ data: mockResults });

        const result = await datastore.getResultsByModel("m-1");
        expect(result).toEqual(mockResults);
        expect(datastore.models["m-1"].loadedResults).toBe(true);
        expect(datastore.models["m-1"].results).toEqual(["r-1", "r-2"]);
        expect(datastore.summary_results["r-1"]).toEqual(mockResults[0]);
    });

    it("returns cached results on cache hit", async () => {
        datastore.models["m-1"] = { id: "m-1", loadedResults: true, results: ["r-1"] };
        datastore.summary_results["r-1"] = { id: "r-1", score: 0.5 };

        const result = await datastore.getResultsByModel("m-1");
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual([{ id: "r-1", score: 0.5 }]);
    });
});

describe("getResultsByModelInstances", () => {
    it("fetches results for multiple model instance IDs", async () => {
        const mockResults = [{ id: "r-1" }, { id: "r-2" }];
        axios.get.mockResolvedValue({ data: mockResults });

        const result = await datastore.getResultsByModelInstances(["mi-1", "mi-2"]);
        const url = axios.get.mock.calls[0][0];
        expect(url).toContain("model_instance_id=mi-1");
        expect(url).toContain("model_instance_id=mi-2");
        expect(result).toEqual(mockResults);
        expect(datastore.extended_results["r-1"]).toEqual(mockResults[0]);
    });
});

describe("getResultsByTest", () => {
    it("fetches results on cache miss", async () => {
        datastore.tests["t-1"] = { id: "t-1", loadedResults: false, results: [] };
        const mockResults = [{ id: "r-1" }];
        axios.get.mockResolvedValue({ data: mockResults });

        const result = await datastore.getResultsByTest("t-1");
        expect(result).toEqual(mockResults);
        expect(datastore.tests["t-1"].loadedResults).toBe(true);
    });

    it("returns cached results on cache hit", async () => {
        datastore.tests["t-1"] = { id: "t-1", loadedResults: true, results: ["r-1"] };
        datastore.summary_results["r-1"] = { id: "r-1" };

        const result = await datastore.getResultsByTest("t-1");
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual([{ id: "r-1" }]);
    });
});

describe("getResultsByTestInstance", () => {
    it("fetches results for multiple test instance IDs", async () => {
        const mockResults = [{ id: "r-1" }];
        axios.get.mockResolvedValue({ data: mockResults });

        const result = await datastore.getResultsByTestInstance(["ti-1", "ti-2"]);
        const url = axios.get.mock.calls[0][0];
        expect(url).toContain("test_instance_id=ti-1");
        expect(url).toContain("test_instance_id=ti-2");
        expect(result).toEqual(mockResults);
    });
});

describe("getResult", () => {
    it("fetches a single result on cache miss", async () => {
        const mockResult = { id: "r-1", score: 0.9 };
        axios.get.mockResolvedValue({ data: mockResult });

        const result = await datastore.getResult("r-1");
        expect(result).toEqual(mockResult);
        expect(datastore.extended_results["r-1"]).toEqual(mockResult);
    });

    it("returns cached result on cache hit", async () => {
        datastore.extended_results["r-1"] = { id: "r-1", score: 0.9 };
        const result = await datastore.getResult("r-1");
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual({ id: "r-1", score: 0.9 });
    });
});

describe("getValidFilterValues", () => {
    it("fetches vocab and projects on first call", async () => {
        const vocabData = { species: ["mouse", "rat"], content_type: ["application/json"] };
        const projectsData = [{ project_id: "p-1" }];
        axios.get
            .mockResolvedValueOnce({ data: vocabData })
            .mockResolvedValueOnce({ data: projectsData });

        const result = await datastore.getValidFilterValues();
        expect(result.species).toEqual(["mouse", "rat"]);
        expect(result.code_format).toEqual(["application/json"]);
        expect(result.project_id).toEqual(["p-1"]);
    });

    it("returns cached vocab on second call", async () => {
        datastore.vocab = { species: ["mouse"] };
        const result = await datastore.getValidFilterValues();
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual({ species: ["mouse"] });
    });
});

describe("getComments", () => {
    it("fetches comments on cache miss", async () => {
        const mockComments = [
            { id: "c-1", timestamp: "2024-01-02", content: "hello" },
            { id: "c-2", timestamp: "2024-01-01", content: "world" },
        ];
        axios.get.mockResolvedValue({ data: mockComments });

        const result = await datastore.getComments("obj-1");
        expect(result).toHaveLength(2);
        expect(datastore.comments["obj-1"]).toBe(result);
    });

    it("returns cached comments on cache hit", async () => {
        datastore.comments["obj-1"] = [{ id: "c-1" }];
        const result = await datastore.getComments("obj-1");
        expect(axios.get).not.toHaveBeenCalled();
        expect(result).toEqual([{ id: "c-1" }]);
    });
});

describe("createComment", () => {
    it("posts a comment and appends to cache", async () => {
        datastore.comments["obj-1"] = [];
        const newComment = { id: "c-new", content: "new comment" };
        axios.post.mockResolvedValue({ data: newComment });

        const result = await datastore.createComment("obj-1", "new comment", false);
        expect(result).toEqual(newComment);
        expect(datastore.comments["obj-1"]).toContainEqual(newComment);
    });
});

describe("updateComment", () => {
    it("puts updated comment data", async () => {
        datastore.comments["obj-1"] = [{ id: "c-1", content: "old" }];
        axios.put.mockResolvedValue({ data: { id: "c-1", content: "updated" } });

        const result = await datastore.updateComment("obj-1", "c-1", "updated", false);
        expect(result).toEqual({ id: "c-1", content: "updated" });
        expect(axios.put).toHaveBeenCalledWith(
            baseUrl + "/comments/c-1",
            { content: "updated" },
            expect.any(Object)
        );
    });

    it("includes status when submit is truthy", async () => {
        datastore.comments["obj-1"] = [];
        axios.put.mockResolvedValue({ data: {} });

        await datastore.updateComment("obj-1", "c-1", "text", true);
        expect(axios.put).toHaveBeenCalledWith(
            baseUrl + "/comments/c-1",
            { content: "text", status: "submitted" },
            expect.any(Object)
        );
    });
});

describe("deleteComment", () => {
    it("deletes a comment and removes from cache", async () => {
        datastore.comments["obj-1"] = [
            { id: "c-1", content: "keep" },
            { id: "c-2", content: "delete" },
        ];
        axios.delete.mockResolvedValue({});

        await datastore.deleteComment("obj-1", "c-2");
        expect(datastore.comments["obj-1"]).toHaveLength(1);
        expect(datastore.comments["obj-1"][0].id).toBe("c-1");
    });
});

describe("getModelInstanceFromVersion", () => {
    it("calls the correct URL", async () => {
        axios.get.mockResolvedValue({ data: {} });
        await datastore.getModelInstanceFromVersion("m-1", "1.0");
        expect(axios.get).toHaveBeenCalledWith(
            baseUrl + "/models/m-1/instances/?version=1.0",
            expect.any(Object)
        );
    });
});

describe("getModelInstanceFromID", () => {
    it("calls the correct URL", async () => {
        axios.get.mockResolvedValue({ data: {} });
        await datastore.getModelInstanceFromID("mi-1");
        expect(axios.get).toHaveBeenCalledWith(
            baseUrl + "/models/query/instances/mi-1",
            expect.any(Object)
        );
    });
});

describe("getTestInstanceFromVersion", () => {
    it("calls the correct URL", async () => {
        axios.get.mockResolvedValue({ data: {} });
        await datastore.getTestInstanceFromVersion("t-1", "2.0");
        expect(axios.get).toHaveBeenCalledWith(
            baseUrl + "/tests/t-1/instances/?version=2.0",
            expect.any(Object)
        );
    });
});

describe("getTestInstanceFromID", () => {
    it("calls the correct URL", async () => {
        axios.get.mockResolvedValue({ data: {} });
        await datastore.getTestInstanceFromID("ti-1");
        expect(axios.get).toHaveBeenCalledWith(
            baseUrl + "/tests/query/instances/ti-1",
            expect.any(Object)
        );
    });
});
