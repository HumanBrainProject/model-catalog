import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from "@material-ui/icons/Edit";
import LockIcon from "@material-ui/icons/Lock";
import PublicIcon from "@material-ui/icons/Public";
import RemoveFromQueueIcon from "@material-ui/icons/RemoveFromQueue";
import { withSnackbar } from "notistack";
import React from "react";
import ContextMain from "../../ContextMain";
import ErrorDialog from "../layout/ErrorDialog";
import ModelEditForm from "../forms/ModelEditForm";
import ModelAddForm from "../forms/ModelAddForm";
import WarningBox from "../layout/WarningBox";
import Theme from "../../utils/theme";
import {
    copyToClipboard,
    formatTimeStampAsDate,
    showNotification,
} from "../../utils/utils";

function AccessibilityIcon(props) {
    if (props.private) {
        return (
            <Tooltip title="private" placement="top">
                <LockIcon color="disabled" />
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title="public" placement="top">
                <PublicIcon color="disabled" />
            </Tooltip>
        );
    }
}

function CompareIcon(props) {
    if (props.compareFlag === null) {
        return (
            <Tooltip
                title="Cannot add to compare (no model instances)"
                placement="top"
            >
                <IconButton
                    aria-label="compare model"
                    style={{
                        backgroundColor: Theme.disabledColor,
                        marginLeft: 10,
                    }}
                >
                    <AddToQueueIcon color="disabled" />
                </IconButton>
            </Tooltip>
        );
    } else if (props.compareFlag) {
        return (
            <Tooltip title="Remove model from compare" placement="top">
                <IconButton
                    aria-label="compare model"
                    onClick={() => props.removeModelCompare()}
                    style={{
                        backgroundColor: Theme.disabledColor,
                        marginLeft: 10,
                    }}
                >
                    <RemoveFromQueueIcon color="action" />
                </IconButton>
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title="Add model to compare" placement="top">
                <IconButton
                    aria-label="compare model"
                    onClick={() => props.addModelCompare()}
                    style={{
                        backgroundColor: Theme.buttonPrimary,
                        marginLeft: 10,
                    }}
                >
                    <AddToQueueIcon color="action" />
                </IconButton>
            </Tooltip>
        );
    }
}

function EditButton(props) {
    if (props.canEdit) {
        return (
            <Tooltip placement="top" title="Edit Model">
                <IconButton
                    aria-label="edit model"
                    onClick={() => props.handleEditClick()}
                    style={{
                        backgroundColor: Theme.buttonPrimary,
                        marginLeft: 10,
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        );
    } else {
        return "";
    }
}

function DuplicateButton(props) {
    if (props.canDuplicate) {
        return (
            <Tooltip placement="top" title="Duplicate Model">
                <IconButton
                    aria-label="duplicate model"
                    onClick={() => props.handleDuplicateClick()}
                    style={{
                        backgroundColor: Theme.buttonPrimary,
                        marginLeft: 10,
                    }}
                >
                    <FileCopyIcon />
                </IconButton>
            </Tooltip>
        );
    } else {
        return "";
    }
}

class ModelDetailHeader extends React.Component {
    static contextType = ContextMain;

    constructor(props, context) {
        super(props, context);

        this.state = {
            openEditForm: false,
            openDuplicateForm: false,
            errorEditModel: null,
            errorDuplicateModel: null,
        };
        this.handleEditModelFormClose = this.handleEditModelFormClose.bind(this);
        this.handleDuplicateModelFormClose = this.handleDuplicateModelFormClose.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleDuplicateClick = this.handleDuplicateClick.bind(this);
        this.handleErrorEditDialogClose = this.handleErrorEditDialogClose.bind(this);
        this.handleErrorDuplicateDialogClose = this.handleErrorDuplicateDialogClose.bind(this);
    }

    handleErrorEditDialogClose() {
        this.setState({ errorEditModel: null });
    }

    handleErrorDuplicateDialogClose() {
        this.setState({ errorDuplicateModel: null });
    }

    handleEditModelFormClose(model) {
        console.log("close edit");

        this.setState({ openEditForm: false });
        if (model) {
            this.props.updateCurrentModelData(model);
            showNotification(
                this.props.enqueueSnackbar,
                this.props.closeSnackbar,
                "Model edited!",
                "success"
            );
        }
    }

    handleDuplicateModelFormClose(model) {
        console.log("close duplicate");

        this.setState({ openDuplicateForm: false });
        if (model) {
            this.props.updateCurrentModelData(model);
            showNotification(
                this.props.enqueueSnackbar,
                this.props.closeSnackbar,
                "Model duplicated!",
                "success"
            );
        }
    }

    handleEditClick() {
        this.setState({
            openEditForm: true,
        });
    }

    handleDuplicateClick() {
        this.setState({
            openDuplicateForm: true,
        });
    }

    render() {
        let errorMessage = "";
        if (this.state.errorEditModel) {
            errorMessage = (
                <ErrorDialog
                    open={Boolean(this.state.errorEditModel)}
                    handleErrorDialogClose={this.handleErrorEditDialogClose}
                    error={
                        this.state.errorEditModel.message ||
                        this.state.errorEditModel
                    }
                />
            );
        }
        if (this.state.errorDuplicateModel) {
            errorMessage = (
                <ErrorDialog
                    open={Boolean(this.state.errorDuplicateModel)}
                    handleErrorDialogClose={this.handleErrorDuplicateDialogClose}
                    error={
                        this.state.errorDuplicateModel.message ||
                        this.state.errorDuplicateModel
                    }
                />
            );
        }

        let editForm = "";
        if (this.state.openEditForm) {
            editForm = (
                <ModelEditForm
                    open={this.state.openEditForm}
                    onClose={this.handleEditModelFormClose}
                    modelData={this.props.modelData}
                />
            );
        }

        let duplicateForm = "";
        if (this.state.openDuplicateForm) {
            duplicateForm = (
                <ModelAddForm
                    open={this.state.openDuplicateForm}
                    onClose={this.handleDuplicateModelFormClose}
                    duplicateData={this.props.modelData}
                />
            );
        }

        const [status] = this.context.status;

        return (
            <React.Fragment>
                <WarningBox message={status} />
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        <AccessibilityIcon private={this.props.private} />
                        <span
                            style={{ marginHorizontal: 125, fontWeight: "bold", color: Theme.darkGreenText, cursor: "pointer", }}
                            onClick={() =>
                                copyToClipboard(
                                    this.props.name,
                                    this.props.enqueueSnackbar,
                                    this.props.closeSnackbar,
                                    "Model name copied"
                                )
                            }
                        >
                            {" "}
                            {this.props.name}
                        </span>
                        <EditButton
                            canEdit={this.props.canEdit}
                            handleEditClick={this.handleEditClick}
                        />
                        <DuplicateButton
                            canDuplicate={status.includes("read-only") ? false : true}
                            handleDuplicateClick={this.handleDuplicateClick}
                        />
                        <CompareIcon
                            compareFlag={this.props.compareFlag}
                            addModelCompare={this.props.addModelCompare}
                            removeModelCompare={this.props.removeModelCompare}
                        />
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        {this.props.authors}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        ID:{" "}
                        <b>
                            <span
                                style={{
                                    marginHorizontal: 125,
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    copyToClipboard(
                                        this.props.id,
                                        this.props.enqueueSnackbar,
                                        this.props.closeSnackbar,
                                        "Model UUID copied"
                                    )
                                }
                            >
                                {this.props.id}
                            </span>
                        </b>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {this.props.alias ? "Alias: " : ""}{" "}
                        <b>
                            {this.props.alias ? (
                                <span
                                    style={{
                                        marginHorizontal: 125,
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        copyToClipboard(
                                            this.props.alias,
                                            this.props.enqueueSnackbar,
                                            this.props.closeSnackbar,
                                            "Model alias copied"
                                        )
                                    }
                                >
                                    {this.props.alias}
                                </span>
                            ) : (
                                ""
                            )}
                        </b>
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                    >
                        Created:{" "}
                        <b>
                            {formatTimeStampAsDate(
                                this.props.dateCreated
                            )}
                        </b>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Custodian:{" "}
                        <b>{this.props.owner}</b>
                    </Typography>
                </Grid>
                {/* <Grid item> */}
                {/* optional image goes here */}
                {/* </Grid> */}
                <div>{editForm}</div>
                <div>{duplicateForm}</div>
                <div>{errorMessage}</div>
            </React.Fragment>
        );
    }
}

export default withSnackbar(ModelDetailHeader);
