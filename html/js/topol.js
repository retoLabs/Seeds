
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
		case 'GRAFO' :
			t = new topol.rGrafo(tag,[]);
			break;
		case 'MALLA' :
			t = new topol.rMalla(tag,[]);
			break;
	}

	if (t == {}) return null;
	utils.r$('topol').innerHTML = utils.o2s(t.meta);
	utils.vgk.topol = t;
	showTopol();
	grabaTopol();
}


function borraTopol(){
	if (!utils.vgk.topolId) return;
	switch (utils.vgk.topol_t){
		case 'CONJT' :
		case 'LISTA' :
		case 'ARBOL' :
		case 'GRAFO' :
			ajax.borraTopol(utils.vgk.topolId);
			break;
	}
	console.log('Borrando ',utils.vgk.topolId);
}
//------------------------------------------------------------------- Edit
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


function montaTablaGrafo(taula,editON){
	var t = utils.vgk.topol;
	var cap = utils.rEl$('thead');
	var cos = utils.rEl$('tbody');
	taula.appendChild(cap);
	taula.appendChild(cos);

	var nodos = t.getNodos();
	var arcos = t.getArcos();
	var arcIds = [];
	arcos.map(function(arc){
		var idArc = ''+arc.nodoI+':'+arc.nodoF;
		arcIds.push(idArc);
	})

	var trh = utils.rEl$('tr');
	var th0 = utils.rEl$('th');
	trh.appendChild(th0);
	nodos.map(function(nodo){
		var thx = utils.rEl$('th');
		thx.innerHTML = nodo.tag;
		trh.appendChild(thx);
		})
	cap.appendChild(trh);

	var trCount = 0;
	nodos.map(function(nodo){
		var trb = utils.rEl$('tr');
		var td0 = utils.rEl$('td');
		td0.innerHTML = nodo.tag;
		trb.appendChild(td0);


		for (var i=0;i<nodos.length;i++){
			var tdx = utils.rEl$('td');
			tdx.id = ''+trCount+':'+i;
			var arcIx = arcIds.indexOf(tdx.id);
			if (arcIx > -1)tdx.innerHTML= arcos[arcIx].tag;
			if (editON){
				tdx.onclick = function(ev){
					utils.r$('tag').value = tdx.innerHTML || 'x';
					utils.r$('id0').value = ev.target.id;
					utils.r$('rol').value = 'ARCO';
					}
				}

			trb.appendChild(tdx);
			}
		cos.appendChild(trb);
		trCount++;
	})

}


function montaTablaMalla(taula,editON){
	var t = utils.vgk.topol;
	var cap = utils.rEl$('thead');
	var cos = utils.rEl$('tbody');
	taula.appendChild(cap);
	taula.appendChild(cos);

	var nrows = t.getNodosRow();
	var ncols = t.getNodosCol();
	var arcos = t.getArcos();
	var arcIds = [];
	arcos.map(function(arc){
		var idArc = ''+arc.ixI+':'+arc.ixF;
		arcIds.push(idArc);
	})

	var trh = utils.rEl$('tr');
	var th0 = utils.rEl$('th');
	trh.appendChild(th0);
	ncols.map(function(nodo){
		var thx = utils.rEl$('th');
		thx.innerHTML = nodo.tag;
		trh.appendChild(thx);
		})
	cap.appendChild(trh);

	var trCount = 0;
	nrows.map(function(nodo){
		var trb = utils.rEl$('tr');
		var td0 = utils.rEl$('td');
		td0.innerHTML = nodo.tag;
		trb.appendChild(td0);


		for (var i=0;i<nrows.length;i++){
			var tdx = utils.rEl$('td');
			tdx.id = ''+trCount+':'+i;
			var arcIx = arcIds.indexOf(tdx.id);
			if (arcIx > -1)tdx.innerHTML= arcos[arcIx].tag;
			if (editON){
				tdx.onclick = function(ev){
					utils.r$('tag').value = tdx.innerHTML || 'x';
					utils.r$('id0').value = ev.target.id;
					utils.r$('rol').value = 'ARCO';
					}
				}

			trb.appendChild(tdx);
			}
		cos.appendChild(trb);
		trCount++;
	})

}

function showTopol(){
	if (!utils.vgk.topol) return;
	var divShow = utils.r$('show');
	divShow.innerHTML = null;
	switch (utils.vgk.topol_t){
		case 'CONJT':
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

		case 'LISTA':
			var nodos = utils.vgk.topol.getNodos();
			if (!nodos.length) divShow.innerHTML = 'Topol sin nodos';
			else {
				var ul = utils.rEl$('ol');
				nodos.map(function(nodo){
					var txt = document.createElement('li');
					txt.innerHTML = nodo.tag;
					ul.appendChild(txt);
				})
				divShow.appendChild(ul);
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

		case 'GRAFO':
			var taula = utils.rEl$('table');
			montaTablaGrafo(taula,false);
			utils.r$('show').appendChild(taula);
			break;

		case 'MALLA':
			var taula = utils.rEl$('table');
			montaTablaMalla(taula,false);
			utils.r$('show').appendChild(taula);
			break;
	}
}

function editTopol(){
	if (!utils.vgk.topol) return;
	var divShow = utils.r$('show');
	divShow.innerHTML = null;
	var t = utils.vgk.topol;

	switch (utils.vgk.topol_t){
		case 'CONJT':
			var nodos = t.getNodos();
			if (!nodos.length) divShow.innerHTML = 'Topol sin nodos';
			else {
				nodos.map(function(nodo){
					var txt = document.createElement('span');
					txt.style = "margin:10px;";
					txt.innerHTML = nodo.tag;
					txt.onclick = function(){
						utils.r$('tag').value = nodo.tag;
						utils.r$('id0').value = nodo.id0;
						utils.r$('rol').value = nodo.rol;
					}
					divShow.appendChild(txt);
				})
			}
			break;
		case 'LISTA':
			var nodos = t.getNodos();
			if (!nodos.length) divShow.innerHTML = 'Topol sin nodos';
			else {
				var ul = utils.rEl$('ol');
				nodos.map(function(nodo){
					var txt = document.createElement('li');
					txt.innerHTML = nodo.tag;
					txt.onclick = function(){
						utils.r$('tag').value = nodo.tag;
						utils.r$('id0').value = nodo.id0;
						utils.r$('rol').value = nodo.rol;
					}
					ul.appendChild(txt);
				})
				divShow.appendChild(ul);
			}
			break;

		case 'ARBOL':
			var tag = t.meta.tag;
			var h3 = utils.rEl$('h3'); h3.innerHTML = tag;
			divShow.appendChild(h3);
			var ul = utils.rEl$('ul');
			ul.style.listStyle = 'none';
			var raiz = t.getRaiz();
			montaArbolUL(ul,raiz,true);
			divShow.appendChild(ul);
			break;

		case 'GRAFO':
			var taula = utils.rEl$('table');
			montaTablaGrafo(taula,true);
			utils.r$('show').appendChild(taula);
			break;

		case 'MALLA':
			var taula = utils.rEl$('table');
			montaTablaMalla(taula,true);
			utils.r$('show').appendChild(taula);
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
	var rol = utils.r$('rol').value;

	switch(acc){
		case 'GRABA':
			if (rol == 'NODO' && id0){
				var nodo = t.getNodoById(id0);
				t.updtNodoSelf(nodo);
			}
			else if (rol == 'ARCO' && id0){
				console.log(tag,id0,rol);
				var ixs = id0.split(':');
				var ixI = parseInt(ixs[0]);
				var ixF = parseInt(ixs[1]);
				var arco = t.getArcoByIxs(ixI,ixF);
				arco.tag = tag;
				t.updtArcoSelf(arco); 
			}
			break;
		case 'BORRA':
			if (rol == 'NODO' && id0){
				var nodo = t.getNodoById(id0);
				t.borraNodo(nodo);
			}
			break;
		case 'SUBE':
			if (rol == 'NODO' && id0){
				var nodo = t.getNodoById(id0);
				t.subeNodo(nodo);
			}
			break;
		case 'BAJA':
			if (rol == 'NODO' && id0){
				var nodo = t.getNodoById(id0);
				t.bajaNodo(nodo);
			}
			break;
		case '+NODO':
			var tag = utils.r$('tag').value;
			var nodo = new topol.rNodo(tag ||'Nuevo');
			t.addNodoSelf(nodo);
			break;
		case '+HIJO':
			if (utils.vgk.topol_t != 'ARBOL') return;
			var padre = t.getNodoById(id0);
			var tag = utils.r$('tag').value;
			var hijo = new topol.rNodo(tag ||'Nuevo');
			t.addNodoHijo(padre,hijo);
			break;
		case '+ARCO':
			if (utils.vgk.topol_t == 'GRAFO'){
				var tag = utils.r$('tag').value;
				var ixs = id0.split(':');
				var ixI = parseInt(ixs[0]);
				var ixF = parseInt(ixs[1]);
				var nodoI = t.getNodoByIx(ixI);
				var nodoF = t.getNodoByIx(ixF);
				var arco = new topol.rArco(tag || 'x',nodoI,nodoF);
				console.log('Arco:',utils.o2s(arco));
				t.addArcoSelf(arco);
			}
			else if (utils.vgk.topol_t == 'MALLA'){
				var tag = utils.r$('tag').value;
				var ixs = id0.split(':');
				var ixI = parseInt(ixs[0]);
				var ixF = parseInt(ixs[1]);
				var nodoI = t.getColByIx(ixI);
				var nodoF = t.getRowByIx(ixF);
				var arco = new topol.rArco(tag || 'x',nodoI,nodoF);
				console.log('Arco:',utils.o2s(arco));
				t.addArcoSelf(arco);
			}
			break;
		case '+ROW':
			if (utils.vgk.topol_t != 'MALLA') return;
			var tag = utils.r$('tag').value;
			var nodo = new topol.rNodo(tag ||'Nuevo');
			nodo.rol = 'NROW';
			t.addNodoSelf(nodo);
			break;
		case '+COL':
			if (utils.vgk.topol_t != 'MALLA') return;
			var tag = utils.r$('tag').value;
			var nodo = new topol.rNodo(tag ||'Nuevo');
			nodo.rol = 'NCOL';
			t.addNodoSelf(nodo);
			break;

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
		case 'GRAFO' :
		case 'MALLA' :
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
		case 'rGrafo':
			var t = new topol.rGrafo('',[]);
			break;
		case 'rMalla':
			var t = new topol.rMalla('',[]);
			break;
	}

	t.objDB2Clase(objDB);
	utils.vgk.topol = t;
//	utils.r$('topol').innerHTML = utils.o2s(t.meta);
	showTopol();
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
		case 'GRAFO' :
			ajax.listaTopols('rGrafo',ecoListaTopols);
			break;
		case 'MALLA' :
			ajax.listaTopols('rMalla',ecoListaTopols);
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
	listaTopol();
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

window.editAction = editAction;
window.vgApp = vgApp;