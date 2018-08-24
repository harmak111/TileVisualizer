// Declaring variables
var i,flagW = 1, flagF = 1, flag = 0, dec=0, wallid = 2, floorid = 2;
var clength, cwidth, dlength, dwidth;

var contactsRef = firebase.database().ref('Tiles');
var dbw = []
var dbf = [];
var tiles = [];
var keyw = 0; keyf = 0;
var entry = {name:"",type:"",size:"",imageLink: "", company:"", material:"", finishing:""};
var html = '';
var j = 0;
var w_size = [], w_finish = [], w_material = [], w_company = [];
var f_size = [], f_finish = [], f_material = [], f_company = [];

function checkboxes(){
  var temp = document.querySelectorAll('[name="w_size"]:checked');
  for (var i = 0; i < temp.length; i++) {w_size[i] = temp[i].value;}
  if(temp.length == 0)
    w_size = null;

  temp = document.querySelectorAll('[name="w_material"]:checked');
  for (var i = 0; i < temp.length; i++) {w_material[i] = temp[i].value;/*console.log(w_material[i]);*/}

  temp = document.querySelectorAll('[name="w_company"]:checked');
  for (var i = 0; i < temp.length; i++) {w_company[i] = temp[i].value;}

  temp = document.querySelectorAll('[name="w_finish"]:checked');
  for (var i = 0; i < temp.length; i++) {w_finish[i] = temp[i].value;}

  temp = document.querySelectorAll('[name="f_size"]:checked');
  for (var i = 0; i < temp.length; i++) {f_size[i] = temp[i].value;}

  temp = document.querySelectorAll('[name="f_material"]:checked');
  for (var i = 0; i < temp.length; i++) {f_material[i] = temp[i].value;}

  temp = document.querySelectorAll('[name="f_company"]:checked');
  for (var i = 0; i < temp.length; i++) {f_company[i] = temp[i].value;}

  temp = document.querySelectorAll('[name="f_finish"]:checked');
  for (var i = 0; i < temp.length; i++) {f_finish[i] = temp[i].value;}

  tiledisplay();
}

function tiledisplay(){
  wallid = 2;
  floorid = 2;
  keyw = 0;
  keyf = 0;
    contactsRef.on("child_added", function(snap) {
        tiles[j] = snap.val();
        j++;
        document.querySelector('#contacts').innerHTML += (contactHtmlFromObject(tiles[j-1]));
    });
    state();
}

function contactHtmlFromObject(contact){
    entry.name = contact.Name;
    entry.type = contact.Type;
    entry.size = contact.Size;
    entry.finishing = contact.Finishing;
    entry.material = contact.Material;
    entry.company = contact.Company;
    entry.imageLink = "https://drive.google.com/uc?id="+contact.ImageLink;
    if(entry.type == 'Wall') {
        dbw[keyw] = entry;
        imagesw(dbw[keyw]);
        console.log(dbw[keyw].material);
        keyw++;
    }
    else {
        dbf[keyf] = entry;
        imagesf(dbf[keyf]);
        //console.log(dbf[keyf]);
        keyf++;
    }
    return html;
}

// Calling functions for initial display
$(document).ready(function(){
  wallPartition(3, 5);
  floorPartition(5, 5, 1/15);
  grout();
  wnf();
  sn2();
  sn3();
  grt();
  uploadTiles();
  tilesInfo();
  checkboxes();
})

$(document).ready(function(){
  setTimeout(function(){
    preloadImages(dbw);
    preloadImages(dbf);
    state();
  },5000);
})

$(document).ready(function(){
    $(document).on('change', 'input[type="checkbox"]', function(){
      $('.tileImage').remove();
        checkboxes();
    });
});


// Window resize
var y=$(window).height();
var b=y*3/5;
$(document).ready(function(){
  $("#wall").css('height',b)
});
// Setting height of floor and wall
$(document).ready(function(){
    $(window).resize(function(){
      var y=$(window).height();
      var b=y*3/5;
      $("#wall").css('height',b);
      $("#div3").css('height',y);
    });
});

//Changing wall tile sizes
function wallPartition(length, width){
    $('div.column').remove();
    dlength = Math.ceil(length);
    dwidth = Math.ceil(width);
    for (i = 0; i < dlength*dwidth; i++)
    {
        var iDiv = document.createElement('div');
        iDiv.className = 'column';
        iDiv.style.borderLeft = '2px solid black';
        iDiv.style.width = 100/width + "%";
        iDiv.style.height = 100/length + "%";
        iDiv.style.backgroundColor = "#222222";
        document.getElementById('wall').appendChild(iDiv);
    }
}

//Changing floor tiles
function floorPartition(length, width, adjust) {
    clength = length;
    cwidth = width;
    $('div.div1').remove();
    y = $(window).height();
    for (i = 0; i < cwidth; i++)
    {
        var iDiv = document.createElement('div');
        iDiv.className = 'div1';
        iDiv.style.width = 100/cwidth + "%";
        document.getElementById('div3').appendChild(iDiv);
        for(var j = 0; j < clength; j++)
        {
            var iDiv2 = document.createElement('div');
            iDiv2.className = 'div2';
            iDiv2.style.border = '1px solid black';
            iDiv2.style.width = "100%%";
            iDiv2.style.height = y*adjust+"px";
            iDiv2.style.backgroundColor = "#DDDDDD";
            iDiv.appendChild(iDiv2);
        }
    }
}

//Adding images for selection
function imagesw(dbw) {
  //console.log(w_size.indexOf(dbw.size) + " " + w_finish.indexOf(dbw.finishing) + " " + w_material.indexOf(dbw.material) + " " + w_company.indexOf(dbw.company));
  if(w_size.indexOf(dbw.size) >= 0 && w_finish.indexOf(dbw.finishing) >= 0 && w_material.indexOf(dbw.material) >= 0 && w_company.indexOf(dbw.company) >= 0)
  {
    var iDiv = document.createElement('button');
    iDiv.id = 'sw' + wallid;
    iDiv.className = "tileImage";
    iDiv.style.background = 'inherit';
    iDiv.value = dbw.imageLink;
    iDiv.name = dbw.size + "!" + dbw.name + "!" + dbw.finishing + "!" + dbw.material + "!" + dbw.company;
    var image = document.createElement('img');
    image.value = dbw.imageLink;
    image.src = dbw.imageLink;
    iDiv.appendChild(image);
    var text  = document.createElement('h5');
    text.innerHTML = dbw.name + "<br>" + dbw.size;
    iDiv.appendChild(text);

    iDiv2 = document.createElement('button');
    iDiv2.id = 'pw' + wallid;
    iDiv2.className = "tileImage";
    iDiv2.style.background = 'inherit';
    iDiv2.value = dbw.imageLink;
    iDiv2.name = dbw.size + "!" + dbw.name + "!" + dbw.finishing + "!" + dbw.material + "!" + dbw.company;
    image = document.createElement('img');
    image.value = dbw.imageLink;
    image.src = dbw.imageLink;
    iDiv2.appendChild(image);
    text  = document.createElement('h5');
    text.innerHTML = dbw.name + "<br>" + dbw.size;

    iDiv2.appendChild(text);

    if(wallid == 2)
    {
        iDiv.className += " active";
        iDiv2.className += " active";
    }

    document.getElementById('btnContainerW4').appendChild(iDiv);
    document.getElementById('btnContainerW3').appendChild(iDiv2);

    wallid++;
  }
}

function imagesf(dbf) {
  console.log(f_size.indexOf(dbf.size) + " " + f_finish.indexOf(dbf.finishing) + " " + f_material.indexOf(dbf.material) + " " + f_company.indexOf(dbf.company));
  if(f_size.indexOf(dbf.size) >= 0 && f_finish.indexOf(dbf.finishing) >= 0 && f_material.indexOf(dbf.material) >= 0 && f_company.indexOf(dbf.company) >= 0)
  {
    var iDiv3 = document.createElement('button');
    iDiv3.id = 'sf' + floorid;
    iDiv3.className = "tileImage";
    iDiv3.style.background = 'inherit';
    iDiv3.value = dbf.imageLink;
    iDiv3.name = dbf.size + "!" + dbf.name + "!" + dbf.finishing + "!" + dbf.material + "!" + dbf.company;
    iDiv3.onclick = "imgf()";
    var image = document.createElement('img');
    image.value = dbf.imageLink;
    image.src = dbf.imageLink;
    iDiv3.appendChild(image);
    var text  = document.createElement('h5');
    text.innerHTML = dbf.name + "<br>" + dbf.size;
    iDiv3.appendChild(text);

    var iDiv4 = document.createElement('button');
    iDiv4.id = 'pf' + floorid;
    iDiv4.className = "tileImage";
    iDiv4.style.background = 'inherit';
    iDiv4.value = dbf.imageLink;
    iDiv4.name = dbf.size + "!" + dbf.name + "!" + dbf.finishing + "!" + dbf.material + "!" + dbf.company;
    iDiv4.onclick = "imgf()";
    image = document.createElement('img');
    image.value = dbf.imageLink;
    image.src = dbf.imageLink;
    iDiv4.appendChild(image);
    text  = document.createElement('h5');
    text.innerHTML = dbf.name + "<br>" + dbf.size;
    iDiv4.appendChild(text);

    if (floorid == 2) {
        iDiv3.className += " active";
        iDiv4.className += " active";
    }
    document.getElementById('btnContainerF4').appendChild(iDiv3);
    document.getElementById('btnContainerF3').appendChild(iDiv4);

    floorid++;
  }
}

//Changing Grout colors
function grout(){
  var container2 = document.getElementById("btnContainerW2");
  var current = container2.getElementsByClassName("active");
  var elements = document.getElementsByClassName('column');
  for(i = 0; i < elements.length; i++)
  {
    elements[i].style.border = '1px solid ' + current[0].value;
  }
  container2 = document.getElementById("btnContainerF2");
  current = container2.getElementsByClassName("active");
  elements = document.getElementsByClassName('div2');
  for(i = 0; i < elements.length; i++)
  {
    elements[i].style.border = '1px solid ' + current[0].value;
  }
}

//Changing image
function imgw(tile){
  var name = tile.name.split("!");
  switch(name[0])
  {
    case '120x60':
      wallPartition(3,5);
      break;
    case '120x120':
      wallPartition(1.5,5);
      break;
    case '60x40':
      wallPartition(5,10);
      break;
    case '80x40':
      wallPartition(5,7);
      break;
    case '120x30':
      wallPartition(6,5);
      break;
  }
  grout();
  var container3 = document.getElementById("btnContainerW3");
  var current3 = container3.getElementsByClassName("active");

  var container4 = document.getElementById("btnContainerW4");
  var current4 = container4.getElementsByClassName("active");

  $('.column > img').remove();
  var elements = document.getElementsByClassName('column');
  if(flagW == '1')
  {
    for(i = 0; i < elements.length; i++)
      {
        elements[i].style.backgroundImage = 'url('+current3[0].value+')';
        elements[i].style.backgroundSize = "100% 100%";
        elements[i].style.backgroundRepeat = "no-repeat";
      }
    }
    else if(flagW == '2')
    {
      for(i = 0; i < dlength; i++)
        {
				var tt=i*dwidth;
				for(var j=i%2;j<dwidth;j=j+2)
				{

					elements[tt+j].style.backgroundImage = 'url('+current3[0].value+')';
					elements[tt+j].style.backgroundSize = "100% 100%";
					elements[tt+j].style.backgroundRepeat = "no-repeat";
                }
				for(var j=(i+1)%2;j<dwidth;j=j+2)
				{
					elements[tt+j].style.background = 'url('+current4[0].value+')';
					elements[tt+j].style.backgroundSize = "100% 100%";
					elements[tt+j].style.backgroundRepeat = "no-repeat";
				}
        }
    }
    else if(flagW == '3'){
      var k = 0;
      var number = elements[0].style.width;
      number = number.slice(0,-1);
      number = 100/number;
      number = Math.floor(number);
      var loop = elements.length/number;
      for(i = 0; i < loop; i++)
        {
          for(var j = 0; j < number; j++)
          {
            if(j%2 == 0)
            {
              elements[k].style.background = 'url('+current3[0].value+')';
              elements[k].style.backgroundSize = "100% 100%";
              elements[k].style.backgroundRepeat = "no-repeat";
            }
            else
            {
                elements[k].style.background = 'url('+current4[0].value+')';
                elements[k].style.backgroundSize = "100% 100%";
                elements[k].style.backgroundRepeat = "no-repeat";
            }
            k++;
          }
        }
    }
    else if(flagW == '4'){
      var k = 0;
      var number = elements[0].style.width;
      number = number.slice(0,-1);
      number = 100/number;
      number = Math.floor(number);

      var loop = elements.length/number;
      for(i = 0; i < loop; i++)
        {
          for(var j = 0; j < number; j++)
          {

            if(i%2 == 0)
            {
              elements[k].style.background = 'url('+current3[0].value+')';
              elements[k].style.backgroundSize = "100% 100%";
              elements[k].style.backgroundRepeat = "no-repeat";
            }
            else
            {
              elements[k].style.background = 'url('+current4[0].value+')';
              elements[k].style.backgroundSize = "100% 100%";
              elements[k].style.backgroundRepeat = "no-repeat";
            }
            k++;
          }
        }
    }
}

function imgf(tile){
  var name = tile.name.split("!");
  switch(name[0])
  {
    case '120x240':
      floorPartition(1, 5, 2/5);
      break;
    case '120x60':
      floorPartition(5, 5, 1/15);
      break;
    case '160x80':
      floorPartition(3, 4, 2/15);
      break;
    case '30x45':
      floorPartition(5, 20, 1/10);
      break;
    case '40x40':
      floorPartition(6, 15, 2/45);
      break;
  }
  grout();
    var container3 = document.getElementById("btnContainerF3");
    var current3 = container3.getElementsByClassName("active");

    var container4 = document.getElementById("btnContainerF4");
    var current4 = container4.getElementsByClassName("active");

    $('.div2 > img').remove();
    var elements = document.getElementsByClassName('div2');
    if(flagF == '1')
    {
        for(i = 0; i < elements.length; i++)
        {
            elements[i].style.background = 'url('+current3[0].value+')';
            elements[i].style.backgroundSize = "100% 100%";
            elements[i].style.backgroundRepeat = "no-repeat";
        }
    }
    else if(flagF == '2')
    {
      var k,tt;
        for(i = 0; i < cwidth; i++)
        {
			tt=clength*i;
			if(i%2==0)
			{
            for(k=0;k<clength;k=k+2)
			{
					elements[tt+k].style.background = 'url(' + current3[0].value + ')';
                    elements[tt+k].style.backgroundSize = "100% 100%";
                    elements[tt+k].style.backgroundRepeat = "no-repeat";
			}
			for(k=1;k<clength;k=k+2)
			{
					elements[tt+k].style.background = 'url(' + current4[0].value + ')';
                    elements[tt+k].style.backgroundSize = "100% 100%";
                    elements[tt+k].style.backgroundRepeat = "no-repeat";
			}
			}
			else if(i%2==1)
			{
				for(k=0;k<clength;k=k+2)
				{
					elements[tt+k].style.background = 'url(' + current4[0].value + ')';
                    elements[tt+k].style.backgroundSize = "100% 100%";
                    elements[tt+k].style.backgroundRepeat = "no-repeat";
				}
				for(k=1;k<clength;k=k+2)
				{
						elements[tt+k].style.background = 'url(' + current3[0].value + ')';
                    elements[tt+k].style.backgroundSize = "100% 100%";
                    elements[tt+k].style.backgroundRepeat = "no-repeat";
				}
			}
		}
	}
    else if(flagF == '3'){
         var k,tt;
        for(i = 0; i < cwidth; i++)
        {
			tt=clength*i;
			if(i%2==0)
			{
				for(k=0;k<clength;k++)
				{
					elements[tt+k].style.background = 'url(' + current3[0].value + ')';
                    elements[tt+k].style.backgroundSize = "100% 100%";
                    elements[tt+k].style.backgroundRepeat = "no-repeat";
				}
			}
			else if(i%2==1)
			{
				for(k=0;k<clength;k++)
				{
					elements[tt+k].style.background = 'url(' + current4[0].value + ')';
                    elements[tt+k].style.backgroundSize = "100% 100%";
                    elements[tt+k].style.backgroundRepeat = "no-repeat";
				}
			}

		}
	}
    else if(flagF == '4'){
				 var k,tt;
        for(i = 0; i < clength; i++)
        {
			if(i%2==0)
			{
				for(k=0;k<cwidth;k++)
				{
					tt=(k*clength)+i;
					elements[tt].style.background = 'url(' + current3[0].value + ')';
                    elements[tt].style.backgroundSize = "100% 100%";
                    elements[tt].style.backgroundRepeat = "no-repeat";
				}
			}
			else if(i%2==1)
			{
				for(k=0;k<cwidth;k++)
				{
					tt=(k*clength)+i;
					elements[tt].style.background = 'url(' + current4[0].value + ')';
                    elements[tt].style.backgroundSize = "100% 100%";
                    elements[tt].style.backgroundRepeat = "no-repeat";
				}
			}
		}
    }
}



//Reset
function reset(){
    var aa = document.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < aa.length; i++){
        aa[i].checked = true;
    }
    $('.tileImage').remove();
    checkboxes();
}


function wnf(id)
{
	var x = document.getElementById("PGY");
	var curr = x.getElementsByClassName("active");
	console.log(curr[0].id);

	if(id=='Wall')
	{
		flag=0;

	}

	else if(id=='Floor')
	{
		flag=1;

	}


	if(flag==0)
	{
		document.getElementById('btnContainerW3').style.display='block';
		document.getElementById('btnContainerF3').style.display='none';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF4').style.display='none';
		document.getElementById('btnContainerW4').style.display='none';
		document.getElementById('addbtn').style.display='none';
	}

	else if(flag==1)
	{

		document.getElementById('btnContainerF3').style.display='block';
		document.getElementById('btnContainerW3').style.display='none';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF4').style.display='none';
		document.getElementById('btnContainerW4').style.display='none';
		document.getElementById('addbtn').style.display='none';
	}


	if(flag==0 && id=='BaseW' && curr[0].id == 'Product' )
	{
		document.getElementById('btnContainerW3').style.display='block';
		document.getElementById('btnContainerF3').style.display='none';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF4').style.display='none';
		document.getElementById('btnContainerW4').style.display='none';

	}

	else if(flag==0 && id=='ComboW' && curr[0].id == 'Product')
	{
		document.getElementById('btnContainerW3').style.display='none';
		document.getElementById('btnContainerF3').style.display='none';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF4').style.display='none';
		document.getElementById('btnContainerW4').style.display='block';

	}

	if(flag==1 && id=='BaseF' && curr[0].id == 'Product')
	{

		document.getElementById('btnContainerF3').style.display='block';
		document.getElementById('btnContainerW3').style.display='none';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF4').style.display='none';
		document.getElementById('btnContainerW4').style.display='none';

	}

	else if(flag==1 && id=='ComboF' && curr[0].id == 'Product')
	{

		document.getElementById('btnContainerF3').style.display='none';
		document.getElementById('btnContainerW3').style.display='none';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF4').style.display='block';
		document.getElementById('btnContainerW4').style.display='none';

	}

	if (flag==0 && id=='btnGrout')
	{
		document.getElementById('btnContainerW2').style.display='block';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerF3').style.display='none';
		document.getElementById('btnContainerW3').style.display='block';
	}
	else if (flag==1 && id=='btnGrout')
	{
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF2').style.display='block';
		document.getElementById('btnContainerF3').style.display='block';
		document.getElementById('btnContainerW3').style.display='none';
	}

	if (flag==0 && id=='yourTiles')
	{
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerF3').style.display='none';
		document.getElementById('btnContainerW3').style.display='none';
		document.getElementById('btnContainerF4').style.display='none';
		document.getElementById('btnContainerW4').style.display='none';
		document.getElementById('addbtn').style.display='block';
	}
	else if (flag==1 && id=='yourTiles')
	{
		document.getElementById('btnContainerW2').style.display='none';
		document.getElementById('btnContainerF2').style.display='none';
		document.getElementById('btnContainerF3').style.display='none';
		document.getElementById('btnContainerW3').style.display='none';
		document.getElementById('btnContainerF4').style.display='none';
		document.getElementById('btnContainerW4').style.display='none';
		document.getElementById('addbtn').style.display='block';
	}


}

var nav = document.getElementById("wallFloor");
var btns = nav.getElementsByClassName("wf");
var x = document.getElementById("PGY");
var z = document.getElementById("SC");
var wall = document.getElementById("btnContainerW5");
var floor = document.getElementById("btnContainerF5");

for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = nav.getElementsByClassName("act");
		var pat = nav.getElementsByClassName("active");
		var curr = x.getElementsByClassName("active");
		var w = wall.getElementsByClassName("active");
		var f = floor.getElementsByClassName("active");
		var filt = z.getElementsByClassName("active");
		var current = nav.getElementsByClassName("act");

        current[0].className = current[0].className.replace(" act", "");
        this.className += " act";


		if(curr[0].id != 'Product'){
			curr[0].className = curr[0].className.replace(" active", "");
			Product.className += " active";
		}


		closeWBaseCombo();
		closeFBaseCombo();


		if(current[0].id == 'Wall'){

			document.getElementById('f_wall').style.display = 'block';
			document.getElementById('f_floor').style.display = 'none';
		}
		else {
			document.getElementById('f_floor').style.display = 'block';
			document.getElementById('f_wall').style.display = 'none';

		}

		 if(pat[0].id == 'Pattern'){

			pat[0].className = pat[0].className.replace(" active", "");
			document.getElementById("WsideNav3").style.width = "0";
			document.getElementById("FsideNav3").style.width = "0";

		}

		else if(filt[0].id == 'Filter'){
			document.getElementById("sideNav2").style.width = "0";
			filt[0].className = filt[0].className.replace(" active", "");
		}




		if(this.id == "Wall" && w[0].value != "1"){
			openWBaseCombo();
		}

		if(this.id == "Floor" && f[0].value != "1"){
			openFBaseCombo();
		}
    });
}


		var current = nav.getElementsByClassName("act");
		if(current[0].id == 'Wall'){

			document.getElementById('f_wall').style.display = 'block';
			document.getElementById('f_floor').style.display = 'none';
		}
		else {
			document.getElementById('f_floor').style.display = 'block';
			document.getElementById('f_wall').style.display = 'none';

		}



var wbc = document.getElementById("WBC");
var btns = wbc.getElementsByClassName("btn-bc");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = wbc.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

var fbc = document.getElementById("FBC");
var btns = fbc.getElementsByClassName("btn-bc");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = fbc.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

var pgy = document.getElementById("PGY");
var btns = pgy.getElementsByClassName("pgt");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = pgy.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}


function sn3(){

var filt = document.getElementById("SC");
var btn = filt.getElementsByClassName("filterr");
var pat = document.getElementById("wallFloor");
var btns = pat.getElementsByClassName("patternn");
var current = pat.getElementsByClassName("act");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){

        if(this.className == "patternn active"){


			this.className = this.className.replace(" active", "");
			document.getElementById("WsideNav3").style.width = "0";
			document.getElementById("FsideNav3").style.width = "0";


		}
		else
		{
			this.className += " active";

			if(current[0].id == 'Wall'){
			document.getElementById("WsideNav3").style.width = "280px";}
			else if(current[0].id == 'Floor'){
			document.getElementById("FsideNav3").style.width = "280px";}

			document.getElementById("sideNav2").style.width = "0";
			if(btn[0].className == "filterr active")
			btn[0].className = btn[0].className.replace(" active", "");
		}
	});
}
}


function sn2(){

var filt = document.getElementById("SC");
var btns = filt.getElementsByClassName("filterr");
var pat = document.getElementById("wallFloor");
var btn = pat.getElementsByClassName("patternn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
		if(this.className == "filterr active"){
			document.getElementById("sideNav2").style.width = "0";
			this.className = this.className.replace(" active", "");
		}
		else
		{
			this.className += " active";
			document.getElementById("sideNav2").style.width = "300px";
			document.getElementById("WsideNav3").style.width = "0";
			document.getElementById("FsideNav3").style.width = "0";

			if(btn[0].className == "patternn active")
				btn[0].className = btn[0].className.replace(" active", "");

		}
	});
}
}


function closesn(){

	var filt = document.getElementById("SC");
	var btn1 = filt.getElementsByClassName("filterr");
	var pat = document.getElementById("wallFloor");
	var btn2 = pat.getElementsByClassName("patternn");
	var btn = document.getElementsByClassName("closebtn");


		if(btn1[0].className == "filterr active"){
			document.getElementById("sideNav2").style.width = "0";
			setTimeout(closeSideNav,200);
			btn1[0].className = btn1[0].className.replace(" active", "");
		}
		else if(btn2[0].className == "patternn active"){
			document.getElementById("WsideNav3").style.width = "0";
			document.getElementById("FsideNav3").style.width = "0";
			setTimeout(closeSideNav,200);
			btn2[0].className = btn2[0].className.replace(" active", "");
		}
		else {
			closeSideNav();
		}
}

function openSideNav() {
    document.getElementById("sideNav").style.width = "400px";
}

function openSideNavW() {
	document.getElementById("Wall").click();
    document.getElementById("sideNav").style.width = "400px";
}

function openSideNavF(){
	document.getElementById("Floor").click();
	 document.getElementById("sideNav").style.width = "400px";
}

function closeSideNav() {
	document.getElementById("sideNav").style.width = "0px";
}

function openUpNav() {
    document.getElementById("upNav").style.height = "376px";
}

function closeUpNav() {
    document.getElementById("upNav").style.height = "0";
}

function openWBaseCombo() {
    document.getElementById("WBC").style.height = "35px";
}

function closeWBaseCombo(){
    $('#BaseW').click();
    document.getElementById("WBC").style.height = "0";
}

function openFBaseCombo() {
    document.getElementById("FBC").style.height = "35px";
}

function closeFBaseCombo(){
    $('#BaseF').click();
    document.getElementById("FBC").style.height = "0";
}




//fullscreen
function toggleFullScreen() {
	if(document.getElementById("FS").className == "fa fa-expand")
		document.getElementById("FS").className = "fa fa-compress";
	else
		document.getElementById("FS").className = "fa fa-expand";

  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
// print
function printscreen(){
window.print();
}

function mail(){
	document.getElementById('btnmail').href = "mailto:?subject=I wanted you to see this amazing website&amp;body=Check out this site http://www.google.com/" ;
}



function genScreenshot() {
	html2canvas(document.body, {onrendered: function(canvas) {
	$('#box1').html("");

  if (navigator.userAgent.indexOf("MSIE ") > 0 ||
                navigator.userAgent.match(/Trident.*rv\:11\./))
        {
    var blob = canvas.msToBlob();
    window.navigator.msSaveBlob(blob,'Test file.png');
  }
  else {
    $('#test').attr('href', canvas.toDataURL("image/png"));
    $('#test').attr('download','screenshot.png');
    $('#test')[0].click();
  }


  }
});
}

function grt(){
var modal = document.getElementById('myModal');


// Get the button that opens the modal
var btn = document.getElementById("btnGrout");

// Get the <span> element that closes the modal
var span = modal.getElementsByClassName("close")[0];


// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
	wnf(this.id);

	 var curr = g.getElementsByClassName("active");
	 if(curr[0].id == 'yourTiles'){
			curr[0].className = curr[0].className.replace(" active", "");
			Product.className += " active";
		}

}

// When the user clicks on <span> (x), close the modal
var g = document.getElementById("PGY");

span.onclick = function() {
    modal.style.display = "none";

	 var curr = g.getElementsByClassName("active");
	 if(curr[0].id == 'yourTiles'){
			curr[0].className = curr[0].className.replace(" active", "");
			Product.className += " active";
		}
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";

	 var curr = g.getElementsByClassName("active");
	 if(curr[0].id == 'yourTiles'){
			curr[0].className = curr[0].className.replace(" active", "");
			Product.className += " active";
		}
    }
}
}


function uploadTiles(){

var modal = document.getElementById('myModal1');


// Get the button that opens the modal
var btn = document.getElementById("addbtn");

// Get the <span> element that closes the modal
var span = modal.getElementsByClassName("close")[0];


// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";

}

// When the user clicks on <span> (x), close the modal

span.onclick = function() {
    modal.style.display = "none";

}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";

		}
	}
}

function tilesInfo(){

	var modal = document.getElementById('info_panel');
	var btn = document.getElementById("Info");

	btn.onclick = function() {
    modal.style.display = "block";
	}

	var span = modal.getElementsByClassName("close_info")[0];


	span.onclick = function() {
    modal.style.display = "none";
	}

	window.onclick = function(event) {
		if (event.target == modal) {
        modal.style.display = "none";
		}
	}

}
// Optional: Add active class to the current button (highlight it)
function state(){
var containerW2 = document.getElementById("btnContainerW2");
var btns = containerW2.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = containerW2.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    grout();
  });
}

var containerF2 = document.getElementById("btnContainerF2");
btns = containerF2.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = containerF2.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        grout();
    });
}

var containerW3 = document.getElementById("btnContainerW3");
btns = containerW3.getElementsByClassName("tileImage");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = containerW3.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    var name = this.name.split("!");
    document.getElementById('bwimage').src = this.value;
    document.getElementById('bwname').innerHTML = "Name: " + name[1];
    document.getElementById('bwsize').innerHTML = "Size: " + name[0];
    document.getElementById('bwfinish').innerHTML = "Finishing: " + name[2];
    document.getElementById('bwmaterial').innerHTML = "Material: " + name[3];
    document.getElementById('bwcompany').innerHTML = "Company: " + name[4];
    imgw(this);
  });
}

var containerF3 = document.getElementById("btnContainerF3");
btns = containerF3.getElementsByClassName("tileImage");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = containerF3.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        var name = this.name.split("!");
        document.getElementById('bfimage').src = this.value;
        document.getElementById('bfname').innerHTML = "Name: " + name[1];
        document.getElementById('bfsize').innerHTML = "Size: " + name[0];
        document.getElementById('bffinish').innerHTML = "Finishing: " + name[2];
        document.getElementById('bfmaterial').innerHTML = "Material: " + name[3];
        document.getElementById('bfcompany').innerHTML = "Company: " + name[4];
        imgf(this);
    });
}

var containerW4 = document.getElementById("btnContainerW4");
btns = containerW4.getElementsByClassName("tileImage");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = containerW4.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    var name = this.name.split("!");
    document.getElementById('cwimage').src = this.value;
    document.getElementById('cwname').innerHTML = "Name: " + name[1];
    document.getElementById('cwsize').innerHTML = "Size: " + name[0];
    document.getElementById('cwfinish').innerHTML = "Finishing: " + name[2];
    document.getElementById('cwmaterial').innerHTML = "Material: " + name[3];
    document.getElementById('cwcompany').innerHTML = "Company: " + name[4];
    imgw(this);
  });
}

var containerF4 = document.getElementById("btnContainerF4");
btns = containerF4.getElementsByClassName("tileImage");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = containerF4.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        var name = this.name.split("!");
        document.getElementById('cfimage').src = this.value;
        document.getElementById('cfname').innerHTML = "Name: " + name[1];
        document.getElementById('cfsize').innerHTML = "Size: " + name[0];
        document.getElementById('cffinish').innerHTML = "Finishing: " + name[2];
        document.getElementById('cfmaterial').innerHTML = "Material: " + name[3];
        document.getElementById('cfcompany').innerHTML = "Company: " + name[4];
        imgf(this);
    });
}

var containerW5 = document.getElementById("btnContainerW5");
btns = containerW5.getElementsByClassName("btn");
var x = document.getElementById("PGY");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = containerW5.getElementsByClassName("active");
	var curr = x.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    flagW = this.value;
	if(curr[0].id == 'Product'){
    if(flagW == '1')
    {
      document.getElementById('btnContainerW4').style.display = 'none';
    }
    else
    {
      document.getElementById('btnContainerW4').style.display = 'block';
        if(flagF == '1')
            document.getElementById('btnContainerW4').style.float = 'none';
        else

            document.getElementById('btnContainerW4').style.float = 'left';
    }
	}
    imgw(this);
  });
}

var containerF5 = document.getElementById("btnContainerF5");
btns = containerF5.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(){
        var current = containerF5.getElementsByClassName("active");
		var curr = x.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        flagF = this.value;
		if(curr[0].id == 'Product'){
        if(flagF == '1')
        {
            document.getElementById('btnContainerF4').style.display = 'none';
            document.getElementById('btnContainerW4').style.float = 'none';
        }
        else
        {
            document.getElementById('btnContainerF4').style.display = 'block';
            if(flagW == '1')
            {
                document.getElementById('btnContainerF4').style.float = 'none';
            }
            else
            {
                document.getElementById('btnContainerW4').style.float = 'left';
            }
        }
		}
        imgf(this);
    });
}
}

function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = array[i].imageLink;
    }
}
