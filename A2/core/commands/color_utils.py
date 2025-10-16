import cv2

def capture():
    """Capture video from camera and detect colors."""
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("No se pudo abrir la cámara")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert to HSV color space
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Define color ranges and masks (example for red)
        lower_red = (0, 120, 70)
        upper_red = (10, 255, 255)
        mask1 = cv2.inRange(hsv, lower_red, upper_red)

        lower_red2 = (170, 120, 70)
        upper_red2 = (180, 255, 255)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)

        mask = mask1 + mask2

        # Bitwise-AND mask and original image
        res = cv2.bitwise_and(frame, frame, mask=mask)

        cv2.imshow('Detección de colores - Rojo', res)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
