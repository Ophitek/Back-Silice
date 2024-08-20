// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationTracker {
    address public owner;
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string purpose;
    }

    struct Allocation {
        string description;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Donation) public donations;
    mapping(uint256 => Allocation[]) public allocations; // Allocations by donation ID

    uint256 public donationCount;

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 donationId,
        string purpose
    );

    event FundsAllocated(
        uint256 donationId,
        string description,
        uint256 amount
    );

    function donate(string memory purpose) external payable {
        require(msg.value > 0, "Debe donar un monto mayor a cero");
        donationCount++;
        donations[donationCount] = Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            purpose: purpose
        });
        emit DonationReceived(msg.sender, msg.value, donationCount, purpose);
    }

    function allocateFunds(
        uint256 donationId,
        string memory description,
        uint256 amount
    ) external {
        require(
            donations[donationId].amount >= amount,
            "Monto excede la donacion disponible"
        );

        allocations[donationId].push(
            Allocation({
                description: description,
                amount: amount,
                timestamp: block.timestamp
            })
        );

        emit FundsAllocated(donationId, description, amount);
    }
    function transferTo(address payable recipient, uint256 amount) public {
        require(
            msg.sender == owner,
            "Solo el propietario puede realizar esta accion"
        );
        require(
            address(this).balance >= amount,
            "Fondos insuficientes en el contrato"
        );
        recipient.transfer(amount);
    }

    function getAllocations(
        uint256 donationId
    ) external view returns (Allocation[] memory) {
        return allocations[donationId];
    }

    function getDonationDetails(
        uint256 donationId
    )
        external
        view
        returns (
            address donor,
            uint256 amount,
            uint256 timestamp,
            string memory purpose
        )
    {
        Donation storage donation = donations[donationId];
        return (
            donation.donor,
            donation.amount,
            donation.timestamp,
            donation.purpose
        );
    }
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
