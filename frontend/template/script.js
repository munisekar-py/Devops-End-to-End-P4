document.addEventListener('DOMContentLoaded', function () {
    fetchProjects();
});

function fetchProjects() {
    fetch('http://localhost:3002/api/projects')
        .then(response => response.json())
        .then(projects => {
            const container = document.getElementById('projectsContainer');
            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.innerHTML = `
                    <div class="col col-lg-4">
                <div class="course_card style_2">
                  <div class="item_image">
                    <a href="course_details.html" data-cursor-text="View">
                      <img src="${project.imageUrl}" alt="${project.projectTitle}" style="width: 738px; height: 394px;">
                    </a>
                  </div>
                  <div class="item_content">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                      <ul class="item_category_list unordered_list">
                        <li><a href="#!">${project.noOfSubProjects} Projects</a></li>
                      </ul>
                      <div class="item_price">
                        <span class="sale_price">INR ${project.pricing}</span>
                      </div>
                    </div>
                    <ul class="meta_info_list unordered_list">
                      <li>
                        <i class="fas fa-clock"></i>
                        <span>120 Hours</span>
                      </li>
                    </ul>
                    <h3 class="item_title">
                      <a href="course_details.html">
                        ${project.projectTitle}
                      </a>
                    </h3>
                    <a class="btn_unfill" href="course_details.html?id=${project._id}">
                      <span class="btn_text">View Project</span>
                      <span class="btn_icon">
                        <i class="fas fa-long-arrow-right"></i>
                        <i class="fas fa-long-arrow-right"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
                `;
                container.appendChild(projectElement);
            });
        })
        .catch(error => console.error('Error loading projects:', error));
}

function initiatePayment(event, projectId, price) {
    event.preventDefault();  // Prevent the form from submitting normally
    const form = event.target;
    const userDetails = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        projectId: projectId,
        amount: price
    };

    fetch('http://localhost:3003/api/payment/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: price, user: userDetails })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data value is: ', data)
        console.log('User details is: ', userDetails)
        openRazorpayCheckout(data, userDetails);
    })
    .catch(error => console.error('Error creating order:', error));
}

function openRazorpayCheckout(orderDetails, userDetails) {
    const options = {
        "key": "rzp_test_a6CEBoBbltCvzC",  // Your Key
        "amount": orderDetails.amount,
        "currency": "INR",
        "name": "Dey Education And Research Private Limited",
        "description": "Project Payment",
        "order_id": orderDetails.id,
        "handler": function (response) {
            console.log('Res: ', response)
            console.log('orderDetails.id:',orderDetails.id)
            console.log('userDetails:',userDetails)
            verifyPayment(response, orderDetails.id, userDetails);
        },
        "prefill": {
            "name": userDetails.name,
            "email": userDetails.email,
            "contact": userDetails.phone
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    console.log('Complete Options is: ', options)
    const paymentProcess = new Razorpay(options);
    paymentProcess.open();
}

function verifyPayment(paymentResponse, orderId, userDetails) {
    fetch('http://localhost:3003/api/payment/verify-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderCreationId: orderId,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpaySignature: paymentResponse.razorpay_signature,
            user: userDetails
        })
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: 'Success!',
            text: 'Payment verified successfully. Payment ID: ' + data.paymentId,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    })
    .catch(error => {
        console.error('Error verifying payment:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to verify payment.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}