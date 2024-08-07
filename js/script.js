const buku = [];
const render = "data buku";

document.addEventListener("DOMContentLoaded", function () {
	const submit = document.getElementById("form_buku");
	submit.addEventListener("submit", function (e) {
		e.preventDefault();
		tambah_buku();
		reset();
		alert("Selamat.! Data Buku Berhasil Ditambahkan");
	});

	if (cekDB()) {
		ambildata();
	}
});

function reset() {
	document.getElementById("form_buku").reset();
	document.getElementById("cari").value = "";
	location.reload();
}

function tambah_buku() {
	const judul = document.getElementById("judul").value;
	const penulis = document.getElementById("penulis").value;
	const terbit = document.getElementById("terbit").value;
	const isComplete = document.getElementById("cek").checked;

	const id = idBuku();
	const data_buku = save(id, judul, penulis, terbit, isComplete);
	buku.push(data_buku);

	document.dispatchEvent(new Event(render));
	simpanBuku();
}

function idBuku() {
	return +new Date();
}

function save(id, judul, penulis, terbit, isComplete) {
	return {
		id,
		judul,
		penulis,
		terbit,
		isComplete,
	};
}

document.addEventListener(render, function () {
	console.log(buku);
	const proses = document.getElementById("proses");
	proses.innerHTML = "";

	const selesai = document.getElementById("selesai");
	selesai.innerHTML = "";

	for (const item of buku) {
		const itemBuku = tampilData(item);
		if (!item.isComplete == true) {
			proses.append(itemBuku);
		} else {
			selesai.append(itemBuku);
		}
	}
});

function tampilData(data_buku) {
	const judulBuku = document.createElement("h3");
	judulBuku.innerText = data_buku.judul;

	const penulisBuku = document.createElement("p");
	penulisBuku.innerText = "Penulis : " + data_buku.penulis;

	const tahunTerbit = document.createElement("p");
	tahunTerbit.innerText = "Terbit : " + data_buku.terbit;

	const textContainer = document.createElement("div");
	textContainer.classList.add("inner");
	textContainer.setAttribute("id", "buku-${data_buku.id}");
	textContainer.append(judulBuku, penulisBuku, tahunTerbit);

	if (data_buku.isComplete) {
		const batalSelesai = document.createElement("button");
		batalSelesai.classList.add("tombolBatal");

		batalSelesai.addEventListener("click", function () {
			if (confirm("Apakah anda yakin ingin membaca ulang Buku ini ?")) {
				batalDiselesaikan(data_buku.id);
			} else {
				location.reload();
			}
		});

		const trashButton = document.createElement("button");
		trashButton.classList.add("tombolHapus");

		trashButton.addEventListener("click", function () {
			if (confirm("Apakah anda yakin ingin menghapus Buku ini ?")) {
				hapusBuku(data_buku.id);
			} else {
				location.reload();
			}
		});

		textContainer.append(batalSelesai, trashButton);
	} else {
		const checkButton = document.createElement("button");
		checkButton.classList.add("tombolSelesai");

		checkButton.addEventListener("click", function () {
			if (confirm("Apakah anda sudah selesai membaca Buku ini ?")) {
				terselesaikan(data_buku.id);
			} else {
				location.reload();
			}
		});

		const trashButton = document.createElement("button");
		trashButton.classList.add("tombolHapus");

		trashButton.addEventListener("click", function () {
			if (confirm("Apakah anda yakin ingin menghapus Buku ini ?")) {
				hapusBuku(data_buku.id);
			} else {
				location.reload();
			}
		});

		textContainer.append(checkButton, trashButton);
	}

	return textContainer;
}

function terselesaikan(kode_buku) {
	const Target = cariBuku(kode_buku);

	if (Target == null) return;

	Target.isComplete = true;
	document.dispatchEvent(new Event(render));
	simpanBuku();
}

function hapusBuku(kode_buku) {
	const Target = cari_indexBuku(kode_buku);

	if (Target === -1) return;

	buku.splice(Target, 1);
	document.dispatchEvent(new Event(render));
	simpanBuku();
}

function batalDiselesaikan(kode_buku) {
	const Target = cariBuku(kode_buku);

	if (Target === null) return;

	Target.isComplete = false;
	document.dispatchEvent(new Event(render));
	simpanBuku();
}

function cariBuku(kode_buku) {
	for (const item of buku) {
		if (item.id === kode_buku) {
			return item;
		}
	}
	return null;
}

function cari_indexBuku(kode_buku) {
	for (const index in buku) {
		if (buku[index].id === kode_buku) {
			return index;
		}
	}

	return -1;
}

function simpanBuku() {
	if (cekDB()) {
		const parsingData = JSON.stringify(buku);
		localStorage.setItem(kunciDB, parsingData);
		document.dispatchEvent(new Event(simpan_data));
	}
}

const simpan_data = "penyimpanan_buku";
const kunciDB = "Bookshelf";

function cekDB() {
	if (typeof Storage === undefined) {
		alert("Browser tidak mendukung Local Storage");
		return false;
	}
	return true;
}

document.addEventListener(simpan_data, function () {
	console.log(localStorage.getItem(kunciDB));
});

function ambildata() {
	const serializedData = localStorage.getItem(kunciDB);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const dataBuku of data) {
			buku.push(dataBuku);
		}
	}

	document.dispatchEvent(new Event(render));
}

document.getElementById("cariData").addEventListener("click", function (e) {
	const input = document.getElementById("cari").value.toUpperCase();
	const listBuku = document.querySelectorAll("h3");

	for (let book of listBuku) {
		const title = book.textContent.toUpperCase();
		// console.log(title);
		if (title.includes(input)) {
			book.parentElement.style.display = "block";
		} else {
			book.parentElement.style.display = "none";
		}
	}
	e.preventDefault();
});

document.getElementById("resetData").addEventListener("click", function () {
	reset();
});
