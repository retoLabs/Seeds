
import utils from '/k1/libK1_Utils.js'
import sess  from '/k1/libK1_Sesion.js'
import ajax  from '/k1/libK1_Ajax.js'
import topol from '/k1/libK1_Topol.js'

import {vgApp,goPag} from '/js/seeds_VGlob.js'


function nuevaTopol(){
	switch (utils.vgk.topol_t){
		case 'CONJT' :
			var tag = prompt('Tag?');
			if (tag) utils.vgk.topol = new topol.rConjt(tag,[]);
			break;
		case 'LISTA' :
			var tag = prompt('Tag?');
			if (tag) utils.vgk.topol = new topol.rLista(tag,[]);
			break;
	}
	utils.r$('topol').innerHTML =utils.o2s(utils.vgk.topol.meta);
}


function borraTopol(){
	switch (utils.vgk.topol_t){
		case 'CONJT' :
			ajax.borraTopol(utils.vgk.topolId);
			break;
	}
	console.log('Borrando ',utils.vgk.topolId);
}
//------------------------------------------------------------------- Edit

function addNodo(){
	var nodo = null;
	switch (utils.vgk.topol_t){
		case 'CONJT' :
			var tag = prompt('Tag?');
			if (tag){
				nodo = new topol.rNodo(tag);
				utils.vgk.topol.addNodo(nodo);
			}
			break;
		case 'LISTA' :
			var tag = prompt('Tag?');
			if (tag){
				nodo = new topol.rNodo(tag);
				utils.vgk.topol.addNodo(nodo);
			}
			break;
	}
	console.log('addNodo ',utils.o2s(nodo));

}
//------------------------------------------------------------------- Show

function showTopol(){
	switch (utils.vgk.topol_t){
		case 'CONJT':
		case 'LISTA':
			var divShow = utils.r$('show');
			divShow.innerHTML = null;
			var nodos = utils.vgk.topol.getNodos();
			if (!nodos.length) divShow.innerHTML = 'Topol sin nodos';
			else {
				nodos.map(function(nodo){
					var txt = document.createElement('span');
					txt.style = "margin:10px;";
					txt.innerHTML = nodo.tag;
					divShow.appendChild(txt);
				})
			}
	}
}

function editTopol(){
	switch (utils.vgk.topol_t){
		case 'CONJT':
		case 'LISTA':
			var divShow = utils.r$('show');
			divShow.innerHTML = null;
			var nodos = utils.vgk.topol.getNodos();
			if (!nodos.length) divShow.innerHTML = 'Topol sin nodos';
			else {
				nodos.map(function(nodo){
					var txt = document.createElement('span');
					txt.style = "margin:10px;";
					txt.innerHTML = nodo.tag;
/*
					txt.onclick = function(){
						var nouTxt = prompt(nodo.tag);
						if (nouTxt) {
							nodo.tag = nouTxt;
							utils.vgk.topol.updtNodoSelf(nodo);
						}
						else {
							var ok = confirm('Borrar ?');
							if (ok) utils.vgk.topol.borraNodo(nodo);
						}
					};
*/
					txt.onclick = function(){
						utils.r$('modal').style.display= 'block';
						utils.r$('tag').value = nodo.tag;
					}
					divShow.appendChild(txt);
				})
			}
	}

}

function editAction(action){
	console.log('editAction', action);
}
//------------------------------------------------------------------- Ajax


function updateTopol(){
	var topol = utils.vgk.topol;
	var _id = utils.vgk.topolId;
	console.log(utils.o2s(topol.clase2ObjDB()));
	console.log(_id);
	ajax.updateTopol(topol,_id);
}


function grabaTopol(){
	switch (utils.vgk.topol_t){
		case 'CONJT' :
			ajax.grabaTopol(utils.vgk.topol);
			break;
		case 'LISTA' :
			ajax.grabaTopol(utils.vgk.topol);
			break;
	}
	console.log(utils.o2s(utils.vgk.topol));
}


function ecoCargaTopol(objDB){
	utils.vgk.topolId = objDB._id;
	console.log('objDB.id:',utils.vgk.topolId);
	var iam = objDB.meta.iam;

	switch(iam){
		case 'rConjt':
			var t = new topol.rConjt('',[]);
			break;
		case 'rLista':
			var t = new topol.rLista('',[]);
			break;
	}

	t.objDB2Clase(objDB);
	utils.vgk.topol = t;
	utils.r$('topol').innerHTML = utils.o2s(t.meta);
}

function cargaTopol(elem){
	ajax.getTopol(elem.value,ecoCargaTopol);
}

function ecoListaTopols(objs){
	var form = utils.r$('lista');
	form.innerHTML = null;

	var select = document.createElement('select');
	select.onchange = function(){cargaTopol(select);};

	objs.map(function(obj,ix){
		var opt = document.createElement('option');
		opt.value = obj._id;
		opt.text = obj.meta.tag;
		select.appendChild(opt);
	})
	form.appendChild(select);
}

function listaTopol(tipo){

	switch (utils.vgk.topol_t){
		case 'CONJT' :
			ajax.listaTopols('rConjt',ecoListaTopols);
			break;
		case 'LISTA' :
			ajax.listaTopols('rLista',ecoListaTopols);
			break;
	}
}


function initTopol(){
	utils.vgk.user = {'org':'DEMO01','keo':''};
	utils.vgk.topol_t = 'CONJT';
}

function cambiaTipo(valor){
	console.log('topol_t', valor);
	utils.vgk.topol = null;
	utils.vgk.topolId = null;
	utils.vgk.topol_t = valor;
	utils.r$('topol').innerHTML = null;
	utils.r$('lista').innerHTML = null;
	utils.r$('show').innerHTML = null;
}

window.onload = initTopol;
window.cambiaTipo = cambiaTipo;
window.nuevaTopol = nuevaTopol;
window.grabaTopol = grabaTopol;
window.borraTopol = borraTopol;
window.listaTopol = listaTopol;
window.showTopol  = showTopol;
window.editTopol  = editTopol;
window.updateTopol= updateTopol;
window.addNodo    = addNodo;

window.editAction = editAction;
window.vgApp = vgApp;