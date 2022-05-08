
import utils from '/k1/libK1_Utils.js'
import sess  from '/k1/libK1_Sesion.js'
import ajax  from '/k1/libK1_Ajax.js'
import topol from '/k1/libK1_Topol.js'

import {vgApp,goPag} from '/js/seeds_VGlob.js'


function nuevaTopol(){
	var t ={};
	var tag = prompt('Tag?');
	if (!tag) return null;

	switch (utils.vgk.topol_t){
		case 'CONJT' :
			t = new topol.rConjt(tag,[]);
			break;
		case 'LISTA' :
			t = new topol.rLista(tag,[]);
			break;
		case 'ARBOL' :
			t = new topol.rArbol(tag,[]);
			break;
	}

	if (t == {}) return null;
	utils.r$('topol').innerHTML = utils.o2s(t.meta);
	utils.vgk.topol = t;
}


function borraTopol(){
	if (!utils.vgk.topolId) return;
	switch (utils.vgk.topol_t){
		case 'CONJT' :
		case 'LISTA' :
		case 'ARBOL' :
			ajax.borraTopol(utils.vgk.topolId);
			break;
	}
	console.log('Borrando ',utils.vgk.topolId);
}
//------------------------------------------------------------------- Edit

function addNodo(){
	if (!utils.vgk.topol) return;
	var nodo = null;
	var tag = prompt('Tag?');
	if (!tag) return null;
	switch (utils.vgk.topol_t){
		case 'CONJT' :
		case 'LISTA' :
			nodo = new topol.rNodo(tag);
			utils.vgk.topol.addNodo(nodo);
			break;
		case 'ARBOL' :
			nodo = new topol.rNodo(tag);
			utils.vgk.topol.addNodoSelf(nodo);
			break;
	}
	console.log('addNodo ',utils.o2s(nodo));
	showTopol();
}

//------------------------------------------------------------------- Show
function montaArbolUL(ul,nodo,editON){
	var li = utils.rEl$('li'); 

	if (nodo.hijos.length){
		var btn = utils.rEl$('input');
		btn.type = 'button';
		btn.value = (nodo.stat == 'EXPAN')? '+' : '-';
		btn.onclick = function (){
			utils.vgk.topol.commuta(nodo);
			showTopol();
		}
		li.appendChild(btn);
	}

	var txt = utils.rEl$('span');
	txt.innerHTML = nodo.tag;
	li.appendChild(txt);

	if (editON){
		li.onclick = function(ev){
			ev.stopImmediatePropagation();
			utils.r$('tag').value = nodo.tag;
			utils.r$('id0').value = nodo.id0;
		}
	}
	ul.appendChild(li);


	if (nodo.hijos.length && nodo.stat == 'EXPAN'){
		var ulx = utils.rEl$('ul');
		ulx.style.listStyle = 'none';
		li.appendChild(ulx);
		var hijos = utils.vgk.topol.getHijosNodo(nodo);
		hijos.map(function(nodox){
			montaArbolUL(ulx,nodox,editON);
		})

	}


}

function showTopol(){
	if (!utils.vgk.topol) return;
	var divShow = utils.r$('show');
	divShow.innerHTML = null;
	switch (utils.vgk.topol_t){
		case 'CONJT':
		case 'LISTA':
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
			break;
		case 'ARBOL':
			var tag = utils.vgk.topol.meta.tag;
			var h3 = utils.rEl$('h3'); h3.innerHTML = tag;
			divShow.appendChild(h3);
			var ul = utils.rEl$('ul');
			ul.style.listStyle = 'none';
			var raiz = utils.vgk.topol.getRaiz();
			montaArbolUL(ul,raiz);
			divShow.appendChild(ul);
			break;

	}
}

function editTopol(){
	if (!utils.vgk.topol) return;
	var divShow = utils.r$('show');
	divShow.innerHTML = null;
	switch (utils.vgk.topol_t){
		case 'CONJT':
		case 'LISTA':
			var nodos = utils.vgk.topol.getNodos();
			if (!nodos.length) divShow.innerHTML = 'Topol sin nodos';
			else {
				nodos.map(function(nodo){
					var txt = document.createElement('span');
					txt.style = "margin:10px;";
					txt.innerHTML = nodo.tag;
					txt.onclick = function(){
						utils.r$('tag').value = nodo.tag;
						utils.r$('id0').value = nodo.id0;
					}
					divShow.appendChild(txt);
				})
			}
			break;
		case 'ARBOL':
			var tag = utils.vgk.topol.meta.tag;
			var h3 = utils.rEl$('h3'); h3.innerHTML = tag;
			divShow.appendChild(h3);
			var ul = utils.rEl$('ul');
			ul.style.listStyle = 'none';
			var raiz = utils.vgk.topol.getRaiz();
			montaArbolUL(ul,raiz,true);
			divShow.appendChild(ul);
			break;

	}
	var frmEdit = utils.r$('frmEdit');
	frmEdit.reset();
	frmEdit.style.display= 'block';

}

function editAction(acc){
	var t = utils.vgk.topol;
	var tag = utils.r$('tag').value;
	var id0 = utils.r$('id0').value;
	var nodo = t.getNodoById(id0);
	console.log('editAction:', acc, utils.o2s(nodo));
	if (acc == 'GRABA'){
		nodo.tag = tag;
		t.updtNodoSelf(nodo);
		}

	else if ( acc == 'BORRA'){t.borraNodo(nodo);}
	
	else if (acc == 'SUBE'){t.subeNodo(nodo);}
	
	else if (acc == 'BAJA'){t.bajaNodo(nodo);}
	/*
	else if (acc == 'SUBE' && utils.vgk.topol_t == 'ARBOL'){
		var padre = t.getNodoById(nodo.id1);
		var h = padre.hijos;
		console.log(utils.o2s(h));
		var ix = h.indexOf(nodo.id0);
		if (ix > 0){
			var aux = h[ix-1];
			h[ix-1] = nodo.id0;
			h[ix] = aux;
			padre.hijos = h;
			t.updtNodoSelf(padre);
			}
		}
	
	else if (acc == 'BAJA' && utils.vgk.topol_t == 'ARBOL'){
		var padre = t.getNodoById(nodo.id1);
		var h = padre.hijos;
		console.log(utils.o2s(h));
		var ix = h.indexOf(nodo.id0);
		if (ix < h.length){
			var aux = h[ix+1];
			h[ix+1] = nodo.id0;
			h[ix] = aux;
			padre.hijos = h;
			t.updtNodoSelf(padre);
			}
		}
*/
	else if (acc == 'HIJO' && utils.vgk.topol_t == 'ARBOL'){
		var hijo = new topol.rNodo('Nuevo');
		t.addNodoHijo(nodo,hijo);
		}

	utils.r$('frmEdit').style.display= 'none';
	showTopol();
}
//------------------------------------------------------------------- Ajax


function updateTopol(){
	if (!utils.vgk.topol||!utils.vgk.topolId) return;
	var t = utils.vgk.topol;
	var _id = utils.vgk.topolId;
	ajax.updateTopol(t,_id);
}


function grabaTopol(){
	if (!utils.vgk.topol) return;
	switch (utils.vgk.topol_t){
		case 'CONJT' :
		case 'LISTA' :
		case 'ARBOL' :
			ajax.grabaTopol(utils.vgk.topol);
			break;
	}
	console.log(utils.o2s(utils.vgk.topol));
}


function ecoCargaTopol(objDB){
	utils.vgk.topolId = objDB._id;
	var iam = objDB.meta.iam;

	switch(iam){
		case 'rConjt':
			var t = new topol.rConjt('',[]);
			break;
		case 'rLista':
			var t = new topol.rLista('',[]);
			break;
		case 'rArbol':
			var t = new topol.rArbol('',[]);
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
	select.onclick = function(){cargaTopol(select);};

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
		case 'ARBOL' :
			ajax.listaTopols('rArbol',ecoListaTopols);
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