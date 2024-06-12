document.addEventListener('DOMContentLoaded', function () {
    fetchProjects();
});

function fetchProjects() {
    fetch('http://localhost:3002/api/projects')  // Adjust to your API endpoint
        .then(response => response.json())
        .then(projects => {
            const container = document.getElementById('projectsContainer');
            projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project-item';
                projectElement.innerHTML = `
                    <h2>${project.projectTitle}</h2>
                    <img src="${project.imageUrl}" class="project-image" alt="${project.projectTitle}">
                    <p>${project.description}</p>
                    <strong>Pricing: INR ${project.pricing}</strong>
                    <form id="paymentForm-${project._id}" onsubmit="initiatePayment(event, '${project._id}', ${project.pricing})">
                        <input type="text" name="name" placeholder="Your Name" required>
                        <input type="email" name="email" placeholder="Your Email" required>
                        <input type="text" name="phone" placeholder="Your Phone Number" required>
                        <button type="submit" class="buy-button">Buy Now</button>
                    </form>
                    <div>
                        <h3>Subprojects:</h3>
                        ${project.subProjects.map(sub => `
                            <div class="subproject">
                                <h4>${sub.projectName}</h4>
                                <p>${sub.projectDescription}</p>
                                <p>Tools Used: ${sub.toolsUsed.join(', ')}</p>
                                <p>Estimated Time: ${sub.timeToWorkOnProject} hours</p>
                            </div>
                        `).join('')}
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