import React, {useEffect, useState} from "react";

export function Input({stateInput}) {
    const exInputSettings = stateInput;
    const [inputSettings, setInputSettings] = useState({
        div1ClassName: 'form-group',
        div2ClassName: 'col-md-4 inputGroupContainer',
        div3ClassName: 'input-group',
        labelClassName: 'col-md-4 control-label',
        labelContent: '',
        spanClassName: 'input-group-addon',
        iClassName: 'glyphicon glyphicon-home',
        inputPlaceholder: '',
        inputClassName: 'form-control',
        inputType: 'text',
    });
    let combined = {     ...inputSettings, ...exInputSettings }
    return (
        <div className={combined.div1ClassName}>
            <label className={combined.labelClassName}>{combined.labelContent}</label>
            <div className={combined.div2ClassName}>
                <div className={combined.div3ClassName}>
                    <span className={combined.spanClassName}><i className={combined.iClassName}></i></span>
                    <input id={combined.labelContent} placeholder={combined.inputPlaceholder} className={combined.inputClassName}  type={combined.inputType}/>
                </div>
            </div>
        </div>
    );
}