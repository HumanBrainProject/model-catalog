import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';

import { formatLabel } from "../../utils/utils";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 700,
        maxWidth: 900,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

export default function SingleSelect(props) {
    const classes = useStyles();
    const fieldId = "select-" + props.label.replace(" ", "-");
    const fieldName = props.name || props.label.toLowerCase().replace(" ", "_");
    const ref = React.useRef();

    const handleChange = (event, value) => {
        const name = ref.current.getAttribute("name");
        props.handleChange({target: {name: name, value: value}});
    };

    return (
        <div>
            <FormControl className={classes.formControl}>
                <Autocomplete
                    id={fieldId}
                    ref={ref}
                    name={fieldName}
                    value={props.value ? props.value : ""}
                    options={props.itemNames}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label={formatLabel(props.label)} />}
                    onChange={handleChange}
                />
                <FormHelperText>{props.helperText}</FormHelperText>
            </FormControl>
        </div>

    );
}
