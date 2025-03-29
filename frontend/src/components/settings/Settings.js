import React, {useState} from "react";
import {Sidebar} from "../sidebar";
import {Input} from "../helpers/Input";
export function Settings() {
    const [formItems, setFormItems] = useState([
        {
            labelContent: 'Имя', inputPlaceholder: 'Имя',
        },
        {
            labelContent: 'Фамилия', inputPlaceholder: 'Фамилия',
        },
        {
            labelContent: 'Услуга', inputPlaceholder: 'Услуга',
        },
        {
            labelContent: 'Тип услуги', inputPlaceholder: 'Тип услуги',
        },
        {
            labelContent: 'Дата', inputPlaceholder: 'Дата',
        },
        {
            labelContent: 'Время начала', inputPlaceholder: 'Время начала',
        },
        {
            labelContent: 'Время окончания', inputPlaceholder: 'Время окончания',
        },
        {
            labelContent: 'Номер бокса', inputPlaceholder: 'Номер бокса',
        },
        {
            labelContent: 'Телефон', inputPlaceholder: 'Телефон',
        },
        {
            labelContent: 'Почта', inputPlaceholder: 'Почта',
        },
    ]);

    return (
        <>
            <div className="app-container">
                <Sidebar/>
                <div className="container">

                    <form className="well form-horizontal" action=" " method="post"  id="contact_form">
                        <fieldset>
                            <legend>Создать заявку на мойку</legend>

                            {formItems.map((formItem, key) => (
                                <Input stateInput={formItem} key={key}/>
                            ))}

                            <div className="form-group">
                                <label className="col-md-4 control-label">State</label>
                                <div className="col-md-4 selectContainer">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-list"></i></span>
                                        <select name="state" className="form-control selectpicker" >
                                            <option value=" " >Please select your state</option>
                                            <option>Alabama</option>
                                            <option>Alaska</option>
                                            <option >Arizona</option>
                                            <option >Arkansas</option>
                                            <option >California</option>
                                            <option >Colorado</option>
                                            <option >Connecticut</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label">Zip Code</label>
                                <div className="col-md-4 inputGroupContainer">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-home"></i></span>
                                        <input name="zip" placeholder="Zip Code" className="form-control"  type="text"/>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label">Website or domain name</label>
                                <div className="col-md-4 inputGroupContainer">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-globe"></i></span>
                                        <input name="website" placeholder="Website or domain name" className="form-control" type="text"/>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label">Do you have hosting?</label>
                                <div className="col-md-4">
                                    <div className="radio">
                                        <label>
                                            <input type="radio" name="hosting" value="yes" /> Yes
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label>
                                            <input type="radio" name="hosting" value="no" /> No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-md-4 control-label">Project Description</label>
                                <div className="col-md-4 inputGroupContainer">
                                    <div className="input-group">
                                        <span className="input-group-addon"><i className="glyphicon glyphicon-pencil"></i></span>
                                        <textarea className="form-control" name="comment" placeholder="Project Description"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="alert alert-success" role="alert" id="success_message">Success <i className="glyphicon glyphicon-thumbs-up"></i> Thanks for contacting us, we will get back to you shortly.</div>

                            <div className="form-group">
                                <label className="col-md-4 control-label"></label>
                                <div className="col-md-4">
                                    <button type="submit" className="btn btn-warning" >Send <span className="glyphicon glyphicon-send"></span></button>
                                </div>
                            </div>

                        </fieldset>
                    </form>
                </div>
            </div>
        </>
    );
}