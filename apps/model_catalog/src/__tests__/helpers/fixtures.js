// Test fixtures based on Pydantic model definitions from
// validation_service_api/validation_service/data_models.py

export const mockPerson = {
    given_name: "Frodo",
    family_name: "Baggins",
};

export const mockPerson2 = {
    given_name: "Tom",
    family_name: "Bombadil",
};

export const mockModelInstance = {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    uri: "https://model-validation-api.apps.ebrains.eu/models/95866c59-26d2-4d84-b1aa-95e1f9cf53bd/instances/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    version: "1.23",
    description: "Initial version of the model",
    parameters: "https://example.com/my_parameters.py",
    code_format: "text/x-python",
    source: "https://example.com/my_code.py",
    license: "MIT License",
    hash: null,
    timestamp: "2024-01-15",
    morphology: null,
    model_id: "95866c59-26d2-4d84-b1aa-95e1f9cf53bd",
    alternatives: [
        "https://search.kg.ebrains.eu/instances/abc123",
    ],
};

export const mockModelInstance2 = {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    version: "2.0",
    description: "Updated version",
    code_format: "text/x-python",
    source: "https://example.com/my_code_v2.py",
    license: "MIT License",
    model_id: "95866c59-26d2-4d84-b1aa-95e1f9cf53bd",
    alternatives: [],
};

export const mockModel = {
    id: "95866c59-26d2-4d84-b1aa-95e1f9cf53bd",
    uri: "https://model-validation-api.apps.ebrains.eu/models/95866c59-26d2-4d84-b1aa-95e1f9cf53bd",
    name: "Potjans & Diesmann, 2014 - microcircuit model of early sensory cortex",
    alias: "PD2014-microcircuit",
    author: [mockPerson, mockPerson2],
    owner: [mockPerson],
    project_id: "model-validation",
    organization: "HBP-SGA3-WP5",
    private: false,
    cell_type: "hippocampus CA1 pyramidal neuron",
    model_scope: "network",
    abstraction_level: "spiking neurons: point neuron",
    brain_region: "CA1 field of hippocampus",
    species: "Rattus norvegicus",
    description: "This is a test model for microcircuit simulation.",
    date_created: "2024-01-15T10:30:45.123456",
    images: [{ caption: "Figure 1", url: "https://example.com/figure_1.png" }],
    instances: [mockModelInstance, mockModelInstance2],
    loadedVersions: true,
    loadedResults: false,
    results: [],
};

export const mockTestInstance = {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    uri: "https://model-validation-api.apps.ebrains.eu/tests/d4e5f6a7-b8c9-0123-defa-234567890123/instances/c3d4e5f6-a7b8-9012-cdef-123456789012",
    version: "1.0",
    description: "Initial test version",
    parameters: null,
    path: "mylib.tests.MeaningOfLifeTest",
    repository: "https://example.com/test_code.py",
    timestamp: "2024-01-15T10:30:45.123456",
    test_id: "d4e5f6a7-b8c9-0123-defa-234567890123",
};

export const mockTest = {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    uri: "https://model-validation-api.apps.ebrains.eu/tests/d4e5f6a7-b8c9-0123-defa-234567890123",
    name: "Hippocampus CA1 Firing Rate Test",
    alias: "hippo-ca1-firing-rate",
    author: [mockPerson, mockPerson2],
    project_id: "model-validation",
    private: false,
    cell_type: "hippocampus CA1 pyramidal neuron",
    brain_region: "CA1 field of hippocampus",
    species: "Rattus norvegicus",
    description: "Test for validating CA1 firing rates",
    date_created: "2024-01-15T10:30:45.123456",
    data_location: ["https://example.com/test_data.csv"],
    data_type: "text/csv",
    recording_modality: "patch clamp",
    test_type: "single cell",
    score_type: "z-score",
    implementation_status: "published",
    instances: [mockTestInstance],
    loadedVersions: true,
    loadedResults: false,
    results: [],
};

export const mockResultFile = {
    download_url: "https://example.com/validation_result_20240115",
    hash: null,
    content_type: "application/json",
    file_store: null,
    local_path: null,
    size: 1024,
    id: null,
};

export const mockResult = {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    uri: "https://model-validation-api.apps.ebrains.eu/results/e5f6a7b8-c9d0-1234-efab-345678901234",
    model_instance_id: mockModelInstance.id,
    test_instance_id: mockTestInstance.id,
    results_storage: [mockResultFile],
    score: 0.1234,
    passed: true,
    timestamp: "2024-01-15T10:30:45.123456",
    project_id: "model-validation",
    normalized_score: 0.2468,
};

export const mockResultSummary = {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    model_instance_id: mockModelInstance.id,
    test_instance_id: mockTestInstance.id,
    test_version: "1.0",
    score: 0.1234,
    score_type: "z-score",
    data_type: "text/csv",
    timestamp: "2024-01-15T10:30:45.123456",
    model_id: mockModel.id,
    model_name: mockModel.name,
    model_alias: mockModel.alias,
    model_version: "1.23",
    test_id: mockTest.id,
    test_name: mockTest.name,
    test_alias: mockTest.alias,
};

export const mockResultExtended = {
    ...mockResult,
    model_instance: mockModelInstance,
    test_instance: mockTestInstance,
    model: mockModel,
    test: mockTest,
};

export const mockComment = {
    id: "f6a7b8c9-d0e1-2345-fabc-456789012345",
    about: `/models/${mockModel.id}`,
    content: "Great model! Has anyone validated this on fresh data?",
    commenter: mockPerson,
    timestamp: "2024-01-15T10:30:45.123456",
    status: "published",
};

export const mockVocab = {
    species: [
        "Homo sapiens",
        "Rattus norvegicus",
        "Mus musculus",
        "Callithrix jacchus",
    ],
    brain_region: [
        "CA1 field of hippocampus",
        "cerebellum",
        "basal ganglia",
    ],
    cell_type: [
        "hippocampus CA1 pyramidal neuron",
        "cerebellar Purkinje cell",
    ],
    model_scope: [
        "single cell",
        "network",
        "network: microcircuit",
    ],
    abstraction_level: [
        "spiking neurons: point neuron",
        "spiking neurons: biophysical",
    ],
    test_type: [
        "single cell",
        "network",
    ],
    score_type: [
        "z-score",
        "p-value",
        "chi-squared statistic",
    ],
    recording_modality: [
        "patch clamp",
        "extracellular electrophysiology",
    ],
    implementation_status: [
        "proposal",
        "in development",
        "published",
    ],
    content_type: [
        "text/x-python",
        "application/json",
        "application/vnd.neuron-simulator+python",
    ],
    code_format: [
        "text/x-python",
        "application/json",
        "application/vnd.neuron-simulator+python",
    ],
    license: [
        "MIT License",
        "BSD 3-Clause 'New' or 'Revised' License",
        "GNU General Public License v3.0 or later",
    ],
    project_id: [
        "model-validation",
        "validation-framework-testing",
    ],
};

export const mockAuth = {
    token: "mock-jwt-token",
    authenticated: true,
};
