import { Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import axios from "axios";
import PropTypes from "prop-types";
import React from "react";
import ContextMain from "./ContextMain";
import ErrorDialog from "./ErrorDialog";
import { filterTestKeys } from "./globals";
import { datastore } from "./datastore";
import { replaceEmptyStringsWithNull } from "./utils";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import PersonSelect from "./PersonSelect";
import SingleSelect from "./SingleSelect";
import Theme from "./theme";

let aliasAxios = null;

export default class TestEditForm extends React.Component {
    signal = axios.CancelToken.source();
    static contextType = ContextMain;

    constructor(props, context) {
        super(props, context);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.createPayload = this.createPayload.bind(this);
        this.checkRequirements = this.checkRequirements.bind(this);
        this.checkAliasUnique = this.checkAliasUnique.bind(this);
        this.getProjectList = this.getProjectList.bind(this);

        const [authContext] = this.context.auth;
        const [validFilterValuesContext] = this.context.validFilterValues;
        const [filtersContext] = this.context.filters;

        this.state = {
            // NOTE: cannot use nested state object owing to performance issues:
            // See: https://dev.to/walecloud/updating-react-nested-state-properties-ga6
            errorEditTest: null,
            isAliasNotUnique: false,
            aliasLoading: false,
            id: "",
            uri: "",
            creation_date: "",
            name: "",
            alias: "",
            author: [],
            project_id: "",
            description: "",
            data_location: [],
            species: "",
            brain_region: "",
            cell_type: "",
            test_type: "",
            score_type: "",
            recording_modality: "",
            auth: authContext,
            filters: filtersContext,
            validFilterValues: validFilterValuesContext,
            loading: false,
            projects: []
        };
        this.getProjectList();
        this.handleErrorEditDialogClose =
            this.handleErrorEditDialogClose.bind(this);
    }

    componentDidMount() {
        this.setState({ ...this.props.testData });
    }

    handleErrorEditDialogClose() {
        this.setState({ errorEditTest: null });
    }

    handleCancel() {
        console.log("Hello");
        this.props.onClose();
    }

    checkAliasUnique(newAlias) {
        if (aliasAxios) {
            aliasAxios.cancel();
        }
        aliasAxios = axios.CancelToken.source();

        if (newAlias === this.props.testData.alias) {
            this.setState({
                isAliasNotUnique: false,
                aliasLoading: false,
            });
            return;
        }

        this.setState({
            aliasLoading: true,
        });

        if (!newAlias) {
            this.setState({
                isAliasNotUnique: true,
                aliasLoading: false,
            });
            return;
        }

        datastore.testAliasIsUnique(newAlias, aliasAxios).then((isUnique) => {
            this.setState({
                isAliasNotUnique: !isUnique,
                aliasLoading: false,
            });
        });
    }

    getProjectList() {
        datastore
            .getProjects()
            .then((editableProjects) => {
                this.setState({
                    projects: editableProjects,
                });
            })
            .catch((err) => {
                console.log("Error: ", err.message);
            });
    }

    createPayload() {
        let payload = {
            id: this.state.id,
            uri: this.state.uri,
            creation_date: this.state.creation_date,
            name: this.state.name,
            alias: this.state.alias,
            author: this.state.author,
            project_id: this.state.project_id,
            description: this.state.description,
            data_location: this.state.data_location,
            species: this.state.species,
            brain_region: this.state.brain_region,
            cell_type: this.state.cell_type,
            test_type: this.state.test_type,
            score_type: this.state.score_type,
            recording_modality: this.state.recording_modality,
        };
        return replaceEmptyStringsWithNull(payload);
    }

    checkRequirements(payload) {
        // rule 1: test name cannot be empty
        let error = null;

        if (!payload.name) {
            error = "Test 'name' cannot be empty!";
        }
        // rule 2: check if alias (if specified) has been changed, and is still unique
        if (
            !this.state.aliasLoading &&
            payload.alias &&
            this.state.isAliasNotUnique
        ) {
            error = error ? error + "\n" : "";
            error += "Test 'alias' has to be unique!";
        }

        if (error) {
            console.log(error);
            this.setState({
                errorEditTest: error,
            });
            return false;
        } else {
            return true;
        }
    }

    handleSubmit() {
        this.setState({ loading: true }, () => {
            let payload = this.createPayload();

            if (this.checkRequirements(payload)) {
                datastore
                    .updateTest(payload, this.signal)
                    .then((test) => {
                        this.props.onClose(test);
                    })
                    .catch((err) => {
                        if (axios.isCancel(err)) {
                            console.log("Error: ", err.message);
                        } else {
                            console.log(err);
                            this.setState({
                                errorEditTest: err.response,
                            });
                        }
                        this.setState({ loading: false });
                    });
            } else {
                this.setState({ loading: false });
            }
        });
    }

    handleFieldChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if (name === "alias") {
            this.checkAliasUnique(value);
        } else if (name === "data_location") {
            value = value
                .replace(/\n/g, ",")
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }
        this.setState({
            [name]: value,
        });
    }

    render() {
        let errorMessage = "";
        if (this.state.errorEditTest) {
            errorMessage = (
                <ErrorDialog
                    open={Boolean(this.state.errorEditTest)}
                    handleErrorDialogClose={this.handleErrorEditDialogClose}
                    error={
                        this.state.errorEditTest.message ||
                        this.state.errorEditTest
                    }
                />
            );
        }

        return (
            <Dialog
                onClose={this.handleClose}
                aria-labelledby="Form for editing an existing test in the library"
                open={this.props.open}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle style={{ backgroundColor: Theme.tableHeader }}>
                    Edit an existing test in the library
                </DialogTitle>
                <DialogContent>
                    <LoadingIndicatorModal open={this.state.loading} />
                    <Box my={2}>
                        <form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="name"
                                        label="Test Name"
                                        defaultValue={this.state.name}
                                        onBlur={this.handleFieldChange}
                                        variant="outlined"
                                        fullWidth={true}
                                        helperText="Please choose an informative name that will distinguish the test from other, similar tests"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <PersonSelect
                                        name="authors"
                                        label="Author(s)"
                                        value={this.state.author}
                                        onChange={this.handleFieldChange}
                                        variant="outlined"
                                        fullWidth={true}
                                        newChipKeys={["Enter", "Tab", ";"]}
                                        helperText="Enter author names separated by semicolon: firstName1 lastName1; firstName2 lastName2"
                                    />
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField
                                        name="alias"
                                        label="Test alias / Short name"
                                        defaultValue={this.state.alias}
                                        onBlur={this.handleFieldChange}
                                        variant="outlined"
                                        fullWidth={true}
                                        error={
                                            !this.state.alias ||
                                                this.state.aliasLoading
                                                ? false
                                                : this.state.isAliasNotUnique
                                        }
                                        helperText={
                                            !this.state.alias ||
                                                this.state.aliasLoading
                                                ? "(optional) Please choose a short name (easier to remember than a long ID)"
                                                : this.state.isAliasNotUnique
                                                    ? "This alias aready exists! "
                                                    : "Great! This alias is unique."
                                        }
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {!this.state.alias ||
                                                        this.state.aliasLoading ? (
                                                        <RadioButtonUncheckedIcon
                                                            style={{
                                                                color: "white",
                                                            }}
                                                        />
                                                    ) : this.state
                                                        .isAliasNotUnique ? (
                                                        <CancelIcon
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        />
                                                    ) : (
                                                        <CheckCircleIcon
                                                            style={{
                                                                color: "green",
                                                            }}
                                                        />
                                                    )}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <SingleSelect
                                        name="project_id"
                                        itemNames={this.state.projects}
                                        label="Collab"
                                        value={this.state.project_id}
                                        helperText="Please choose the Collab you will use to set access permissions. You may need to create a new Collab."
                                        handleChange={this.handleFieldChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        multiline
                                        rows="6"
                                        name="description"
                                        label="Description"
                                        defaultValue={this.state.description}
                                        onBlur={this.handleFieldChange}
                                        variant="outlined"
                                        fullWidth={true}
                                        helperText="The description may be formatted with Markdown"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="data_location"
                                        label="Data Location (URL)"
                                        defaultValue={this.state.data_location}
                                        onBlur={this.handleFieldChange}
                                        variant="outlined"
                                        fullWidth={true}
                                        helperText="Enter location of target experimental data file(s). Separate each file location with a comma or a new line."
                                        multiline
                                        rows={3}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Tooltip
                                                        title={
                                                            this.state
                                                                .data_location
                                                                .length +
                                                            " files(s) specified"
                                                        }
                                                    >
                                                        <Avatar
                                                            style={{
                                                                width: "30px",
                                                                height: "30px",
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="subtitle1"
                                                                style={{
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {
                                                                    this.state
                                                                        .data_location
                                                                        .length
                                                                }
                                                            </Typography>
                                                        </Avatar>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                {filterTestKeys.map((filter) => (
                                    <Grid item xs={12} key={filter}>
                                        <SingleSelect
                                            itemNames={
                                                this.state.filters[filter] &&
                                                    this.state.filters[filter]
                                                        .length
                                                    ? this.state.filters[filter]
                                                    : this.state
                                                        .validFilterValues[
                                                    filter
                                                    ]
                                            }
                                            label={filter}
                                            value={
                                                this.state[filter]
                                                    ? this.state[filter]
                                                    : ""
                                            }
                                            handleChange={
                                                this.handleFieldChange
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </form>
                    </Box>
                    <div>{errorMessage}</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSubmit} color="primary">
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

TestEditForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};
