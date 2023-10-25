const cart = [];
let totalPrice = 0; //showShoppingCart에서도 쓸꺼지만 showProductCharge에서도 정보를 띄워야하니까 전역변수로 설정 (매개변수로 하니까 왠진 모르겠는데 안됨)

// "장바구니" 버튼 클릭 시 장바구니 팝업을 나타냄
document.querySelector('.basket_button').addEventListener('click', function() {
    showShoppingCart();
});

// "닫기" 버튼 클릭 시 장바구니 팝업을 숨김
document.querySelector('#close-basket').addEventListener('click', function() {
    hideShoppingCart();
});

//장바구니에서 결제하기 누르면 장바구니창은 끄게하고 결제하기창을 킴
document.querySelector('#product-basket-charge').addEventListener('click', function () {
    hideShoppingCart();
    showProductCharge();
})

function showShoppingCart() {
    const basketPopup = document.querySelector('.product-basket');
    basketPopup.style.display = 'block';

    // 장바구니 내용을 업데이트하고 합계 가격을 계산하여 표시
    const basketItems = document.querySelector('#basket-items');
    // const totalPrice = document.querySelector('#total-price');
    totalPrice = document.querySelector('#total-price')
    basketItems.innerHTML = ''; // 장바구니 내용 초기화

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        let itemText = `${cart[i].name} `;
        if (cart[i].name.includes("샌드위치") || cart[i].name.includes("샐러드")) {
            itemText += `(${cart[i].options})`;
        }
        itemText += `: ${cart[i].price}원`;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item'); // 스타일 클래스 추가
        itemElement.textContent = itemText;

        // "삭제" 버튼을 추가하고 해당 버튼을 클릭하면 아이템을 장바구니에서 제거
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button'); // 스타일 클래스 추가
        deleteButton.textContent = ''; // 빈 문자열로 설정

        // "x_black" 이미지를 deleteButton 버튼의 배경 이미지로 설정
        deleteButton.style.backgroundImage = 'url("images/x_black.png")';
        deleteButton.style.backgroundSize = '20px 20px'; // 이미지 크기 조정
        deleteButton.style.width = '23px'; // 버튼의 너비 조정
        deleteButton.style.height = '23px'; // 버튼의 높이 조정
        deleteButton.dataset.index = i; // 아이템 인덱스를 저장

        deleteButton.addEventListener('click', function() {
            const index = this.dataset.index;
            cart.splice(index, 1); // 아이템을 장바구니에서 제거
            showShoppingCart(); // 장바구니를 업데이트하고 다시 표시
        });

        itemElement.appendChild(deleteButton);
        basketItems.appendChild(itemElement);

        total += cart[i].price;

    }

    totalPrice.textContent = `합계: ${total}원`;
}

function hideShoppingCart() {
    document.querySelector('.product-basket').style.display = 'none';
}

// JSON 처리
function loadProducts() {
    fetch('/json/products.json')
        .then(response => response.json())
        .then(productsData => {
            var imageElements = document.querySelectorAll('#sandwich_table img, #salad_table img, #lab_table img, #beverage_table img');
            imageElements.forEach(function(img) {
                img.addEventListener('click', function(event) {
                    // console.log(event)
                    var productName = event.target.dataset.product;
                    // console.log(productName)
                    var productInfo = productsData[productName];
                    if (productInfo) {
                        var productName = productInfo.name;
                        var productPrice = productInfo.price;
                        var productImage = productInfo.img;

                        document.getElementById('product-name').textContent = productName;
                        document.getElementById('product-price').textContent = '가격: ' + productPrice + '원';

                        document.getElementById('product-image').src = productImage;

                        // "장바구니에 담기" 버튼 클릭 시
                        function add() {
                            // console.log(productName)
                            const selectedOptions = {
                                breadSize: [],
                                breadToasting: [],
                                bread: [],
                                cheese: [],
                                sauce: [],
                                vegetable: []
                            };

                            const breadSizeRadios = document.querySelectorAll('input[name="breadSize"]');
                            breadSizeRadios.forEach((radio) => {
                                if (radio.checked) {
                                    selectedOptions.breadSize.push(radio.value);
                                }
                            });

                            const breadToastingRadios = document.querySelectorAll('input[name="breadToasting"]');
                            breadToastingRadios.forEach((radio) => {
                                if (radio.checked) {
                                    selectedOptions.breadToasting.push(radio.value);
                                }
                            });

                            const breadRadios = document.querySelectorAll('input[name="bread"]');
                            breadRadios.forEach((radio) => {
                                if (radio.checked) {
                                    selectedOptions.bread.push(radio.value);
                                }
                            });

                            const cheeseRadios = document.querySelectorAll('input[name="cheese"]');
                            cheeseRadios.forEach((radio) => {
                                if (radio.checked) {
                                    selectedOptions.cheese.push(radio.value);
                                }
                            });

                            const sauceCheckboxes = document.querySelectorAll('input[name="sauce"]');
                            sauceCheckboxes.forEach((checkbox) => {
                                if (checkbox.checked) {
                                    selectedOptions.sauce.push(checkbox.value);
                                }
                            });

                            const vegetableCheckboxes = document.querySelectorAll('input[name="vegetable"]');
                            vegetableCheckboxes.forEach((checkbox) => {
                                if (checkbox.checked) {
                                    selectedOptions.vegetable.push(checkbox.value);
                                }
                            });

                            const selectedOptionsText = [];
                            const optionGroups = ['breadSize', 'breadToasting', 'bread', 'cheese', 'sauce', 'vegetable'];
                            optionGroups.forEach(group => {
                                if (selectedOptions[group].length > 0) {
                                    selectedOptionsText.push(selectedOptions[group].join(', '));
                                }
                            });

                            let selectedOptionsString = selectedOptionsText.join(' | ');


                            cart.push({
                                name: productName,
                                price: productPrice,
                                options: selectedOptionsString
                            });
                            alert('장바구니에 제품이 추가되었습니다.');
                            document.getElementById('add-to-cart').removeEventListener('click', add)
                            document.querySelector('.product-popup').style.display = 'none';
                            resetSelectedLabels();
                        }
                        document.getElementById('add-to-cart').addEventListener('click', add)
                        // console.log(document.getElementById('add-to-cart'))
                        document.querySelector('.product-popup').style.display = 'block';
                    }
                });
            });
        })
}

// 플로팅 창 닫기 버튼
document.querySelector('#close-popup').addEventListener('click', function() {
    document.querySelector('.product-popup').style.display = 'none';
    resetSelectedLabels();
});

function resetSelectedLabels() {
    const inputElements = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    inputElements.forEach((inputElement) => {
        inputElement.checked = false;
    });
}

// products.json 파일을 불러와서 제품 정보를 처리
loadProducts();

// "샌드위치" 버튼 클릭 시
document.querySelector('.sandwich_button').addEventListener('click', function() {
    showTable('sandwich_table');
    showOptionsForLabels('.product-options', '.breadOptions', '.sauceLabel', '.cheeseLabel', '.vegetableLabel', '.option_select_text');
});

// "샐러드" 버튼 클릭 시
document.querySelector('.salad_button').addEventListener('click', function() {
    showTable('salad_table');
    showOptionsForLabels('.product-options', '.breadOptions', '.cheeseLabel', '.sauceLabel', '.vegetableLabel', '.option_select_text');
    hideOptionsForLabels('.breadOptions');
});

// "사이드 & 음료" 버튼 클릭 시
document.querySelector('.beverage_button').addEventListener('click', function() {
    showTable('beverage_table');
    showOptionsForLabels('.product-options', '.breadOptions', '.sauceLabel', '.cheeseLabel', '.vegetableLabel');
    hideOptionsForLabels('.product-options');
});

// "랩/기타" 버튼 클릭 시
document.querySelector('.lab_button').addEventListener('click', function() {
    showTable('lab_table');
    showOptionsForLabels('.product-options', '.breadOptions', '.sauceLabel', '.cheeseLabel', '.vegetableLabel');
    hideOptionsForLabels('.product-options');
});


// 라벨 숨기기 함수
function hideOptionsForLabels(...labels) {
    for (const label of labels) {
        const labelElements = document.querySelectorAll(label);
        labelElements.forEach((labelElement) => {
            labelElement.style.display = 'none';
        });
    }
}

function showOptionsForLabels(...labels) {
    for (const label of labels) {
        const labelElements = document.querySelectorAll(label);
        labelElements.forEach((labelElement) => {
            labelElement.style.display = 'block';
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // 페이지가 로드되면 초기 인디케이터 위치 설정
    moveIndicator(sandwichButton);
});

// 테이블 표시 함수
function showTable(tableId) {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        table.style.display = 'none';
    });
    document.getElementById(tableId).style.display = 'table';
}

const sandwichButton = document.querySelector('.sandwich_button');
const saladButton = document.querySelector('.salad_button');
const labButton = document.querySelector('.lab_button');
const beverageButton = document.querySelector('.beverage_button');
const indicator = document.querySelector('.indicator');

function moveIndicator(button) {
    const buttonRect = button.getBoundingClientRect();
    const indicatorRect = indicator.getBoundingClientRect();

    indicator.style.display = 'block';
    indicator.style.top = buttonRect.bottom + 'px';
    indicator.style.left = buttonRect.left + buttonRect.width / 2 - indicatorRect.width / 2 + 'px';
}

const sandwichTable = document.getElementById('sandwich_table');
const saladTable = document.getElementById('salad_table');
const labTable = document.getElementById('lab_table');
const beverageTable = document.getElementById('beverage_table');

sandwichButton.addEventListener('click', () => {
    sandwichTable.style.display = 'table';
    saladTable.style.display = 'none';
    labTable.style.display = 'none';
    beverageTable.style.display = 'none';
    moveIndicator(sandwichButton);
});

saladButton.addEventListener('click', () => {
    saladTable.style.display = 'table';
    sandwichTable.style.display = 'none';
    beverageTable.style.display = 'none';
    labTable.style.display = 'none';
    moveIndicator(saladButton);
});

labButton.addEventListener('click', () => {
    labTable.style.display = 'table';
    saladTable.style.display = 'none';
    sandwichTable.style.display = 'none';
    beverageTable.style.display = 'none';
    moveIndicator(labButton);
})

beverageButton.addEventListener('click', () => {
    beverageTable.style.display = 'table';
    saladTable.style.display = 'none';
    sandwichTable.style.display = 'none';
    labTable.style.display = 'none';
    moveIndicator(beverageButton);
} )

document.querySelector('.payment_button').addEventListener('click', function() {
    showProductCharge();
})

document.querySelector('#close-charge').addEventListener('click', function() {
    hideProductCharge();
})

function showProductCharge() {
    const ProductChargePopup = document.querySelector('.product-charge');
    ProductChargePopup.style.display = 'block';
    const ProductChargeMainPopup = document.querySelector('.product-charge-main');
    ProductChargeMainPopup.style.display = 'block';
    // final-charge-bar 요소를 선택
    const finalChargeBar = document.querySelector('.final-charge-bar');
    finalChargeBar.style.display = 'block';

    const naverPayCharge = document.querySelector('.charge-by-naverpay');
    const kakaoPayCharge = document.querySelector('.charge-by-kakaopay');

    // totalPrice 변수의 값을 가져와서 final-charge-bar 요소에 표시
    finalChargeBar.textContent = `결제액 ${totalPrice.textContent}`;


    // totalPrice = document.querySelector('.final-charge-bar')
    // console.log('Total Price:', totalPrice);
}

function hideProductCharge() {
    document.querySelector('.product-charge').style.display = 'none';
}